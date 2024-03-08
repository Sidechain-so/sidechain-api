const { getDatabase } = require("../config/mongodb-config");
const { ObjectId } = require("mongodb");
const { getJobsByCompany } = require("./Jobs");
const { getBountiesByCompany } = require("./Bounties");
const { dbCollections } = require("../helpers/constants");

const getCompanies = async (req, res, next) => {
    try {
        const client = getDatabase();
        const data = await client.db().collection(dbCollections.COMPANIES).find().toArray();
        return res.json(data);
    } catch (e) {
        next(e);    
    }
};

const getCompanyById = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const client = getDatabase();
        
        const query = { _id: new ObjectId(companyId) };
        
        const company = await client.db().collection(dbCollections.COMPANIES).findOne(query);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        const companyJobs = await getJobsByCompany(companyId);
        const bountiesJobs = await getBountiesByCompany(companyId);

        const result = {
            ...company,
            jobs: companyJobs,
            bounties: bountiesJobs,
        }

        return res.json(result);
    } catch (e) {
        next(e);
    }
}

const createCompany = async (req, res, next) => {
    try {
        const {
            companyName,
            companyDesc,
            companyImage,
            companyAvatar,
            aboutUs,
            total,
            stage,
            websiteLink,
            size,
            hq,
            type,
            xLink,
            linkedIn     
        } = req.body;     
        const client = getDatabase();

        const newCompany = {
            companyName,
            companyDesc,
            companyImage,
            companyAvatar,
            aboutUs,
            fundRaised: {
                total,
                stage 
            },
            overview: {
                websiteLink,
                size,
                hq,
                type
            },
            usefulLinks: {
                xLink,
                linkedIn
            }  
        };
        
        const result = await client.db().collection(dbCollections.COMPANIES).insertOne(newCompany);

        return res.status(201).json({ message: "Company created successfully", companyId: result.insertedId });
    } catch (e) {
        next(e);
    }
}

const updateCompany = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const updatedFields = req.body;

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const client = getDatabase();
        const query = { _id: new ObjectId(companyId) };
        const updateQuery = { $set: updatedFields };

        const result = await client
            .db()
            .collection(dbCollections.COMPANIES)
            .updateOne(query, updateQuery);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.json({ message: "Company updated successfully", result: result });
    } catch (e) {
        next(e);
    }
}

const deleteCompany = async (req, res, next) => {
    try {
        const { companyId } = req.params;

        const client = getDatabase();
        const query = { _id: new ObjectId(companyId) };

        const result = await client
            .db()
            .collection(dbCollections.COMPANIES)
            .deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.json({ message: "Company deleted successfully" });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
}
