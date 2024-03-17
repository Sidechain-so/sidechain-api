const puppeteer = require('puppeteer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbCollections } = require("../helpers/constants");
const { getDatabase } = require("../config/mongodb-config");

const signUp = async (req, res, next) => {
    const {
        companyName,
        email,
        password,
        twitterLink
    } = req.body;

    try {
        const companyObj = await fetchCompanyData(twitterLink);
        
        const existingUser = await checkUserExist(email);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            email: email,
            password: hashedPassword,
            userType: "COMPANY",
            createdDate: Date.now(),
            updatedDate: Date.now(),
            userData: {
                companyName: companyName,
                companyDesc: companyObj.companyDesc,
                companyImage: companyObj.companyImage,
                companyAvatar: companyObj.companyAvatar,
                aboutUs: "",
                fundRaised: {
                    total: "",
                    stage: "" 
                },
                overview: {
                    websiteLink: "",
                    size: "",
                    hq: "",
                    type: ""
                },
                usefulLinks: {
                    xLink: "",
                    linkedIn: ""
                }   
            }
        }
        await createUser(newUser);

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await checkUserExist(email);

        if (!existingUser.length > 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!bcrypt.compareSync(password, existingUser[0].password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: existingUser[0]._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const createUser = async (newUser) => {
    const client = getDatabase();

    const result = await client
        .db()
        .collection(dbCollections.USERS)
        .insertOne(newUser);

    return result;
};

const checkUserExist = async (email) => {
    const client = getDatabase();

    const query = { email: email };

    const existingUser = await client.db()
        .collection(dbCollections.USERS)
        .find(query)
        .toArray();
    
    return existingUser;
};

const fetchCompanyData = async (twitterLink) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
        await page.goto(twitterLink);

        const imgSrcs = await page.$$eval('img', imgs => imgs.map(img => img.getAttribute('src')));

        const imgUrls = imgSrcs.reduce((result, src) => {
            if (src.includes('profile_banners')) {
                result.profile_banners = src;
            } else if (src.includes('profile_images')) {
                result.profile_images = src;
            }
            return result;
        }, {});

        const description = await page.$eval('[data-testid="UserDescription"]', element => element.textContent.trim());

        return {
            companyAvatar: imgUrls.profile_banners,
            companyImage: imgUrls.profile_images,
            companyDesc: description
        };
    } catch (error) {
        throw error;
    } finally {
        await browser.close();
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.userId = user.userId;
        next();
    });
}

module.exports = {
    signUp,
    signIn,
    authenticateToken
};
