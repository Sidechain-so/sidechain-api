const { getDatabase } = require("../config/mongodb-config");
const { ObjectId } = require("mongodb");
const { getBountiesByCandidate } = require("./Bounties");
const { dbCollections } = require("../helpers/constants");

const getCandidates = async (req, res, next) => {
    try {
        const client = getDatabase();
        const data = await client.db().collection(dbCollections.CANDIDATES).find().toArray();
        return res.json(data);
    } catch (e) {
        next(e);    
    }
};

const getCandidateById = async (req, res, next) => {
    try {
        const { candidateId } = req.params;
        const client = getDatabase();
        
        const query = { _id: new ObjectId(candidateId) };
        
        const candidate = await client.db().collection(dbCollections.CANDIDATES).findOne(query);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        
        const bounties = await getBountiesByCandidate(candidateId);

        const result = {
            ...candidate,
            bounties: bounties,
        }

        return res.json(result);
    } catch (e) {
        next(e);
    }
}

const createCandidate = async (req, res, next) => {
    try {
        const { 
            name, 
            jobPosition, 
            salary, 
            location, 
            avatarImg, 
            usefulLinks, 
            status, 
            resumeFile, 
            about, 
            skills, 
            languages, 
            experience, 
            education, 
            bounties 
        } = req.body;
        
        if (
            !name || 
            !jobPosition ||
            !location || 
            !avatarImg || 
            !resumeFile || 
            !status
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const client = getDatabase();
        
        const result = await client.db().collection(dbCollections.CANDIDATES).insertOne({
            name,
            jobPosition,
            salary,
            location,
            avatarImg,
            usefulLinks,
            status,
            resumeFile,
            about,
            skills,
            languages,
            experience,
            education,
            bounties
        });

        return res.status(201).json({ message: "Candidate created successfully", candidateId: result.insertedId });
    } catch (e) {
        next(e);
    }
}

const updateCandidate = async (req, res, next) => {
    try {
        const { candidateId } = req.params;
        const updatedFields = req.body;

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const client = getDatabase();
        const query = { _id: new ObjectId(candidateId) };
        const updateQuery = { $set: updatedFields };

        const result = await client
            .db()
            .collection(dbCollections.CANDIDATES)
            .updateOne(query, updateQuery);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        return res.json({ message: "Candidate updated successfully" });
    } catch (e) {
        next(e);
    }
}

const deleteCandidate = async (req, res, next) => {
    try {
        const { candidateId } = req.params;

        const client = getDatabase();
        const query = { _id: new ObjectId(candidateId) };

        const result = await client
            .db()
            .collection(dbCollections.CANDIDATES)
            .deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        return res.json({ message: "Candidate deleted successfully" });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate
}
