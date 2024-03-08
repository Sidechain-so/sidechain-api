const { getDatabase } = require("../config/mongodb-config");
const { ObjectId } = require("mongodb");
const { dbCollections } = require("../helpers/constants");

const getJobsByCompany = async (companyId) => {
    const client = getDatabase();

    const query = { companyId: new ObjectId(companyId) };
        
    const jobs = await client.db()
        .collection(dbCollections.JOBS)
        .find(query)
        .toArray();

    return jobs;
}

const getJobById = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const client = getDatabase();
        
        const query = { _id: new ObjectId(jobId) };
        
        const company = await client.db().collection(dbCollections.JOBS).findOne(query);
        if (!company) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.json(company);
    } catch (e) {
        next(e);
    }
}

const getJobs = async () => {
    try {
        const client = getDatabase();
        const data = await client.db().collection(dbCollections.JOBS).find().toArray();
        return res.json(data);
    } catch (e) {
        next(e);    
    }
}

const createJob = async (req, res, next) => {
    try {
        const { 
            jobName, 
            tags, 
            price, 
            companyId
        } = req.body;
        
        if (
            !jobName || 
            !tags || 
            !price || 
            !companyId
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const client = getDatabase();
        
        const result = await client.db().collection(dbCollections.JOBS).insertOne({
            jobName, 
            tags, 
            price, 
            companyId
        });

        return res.status(201).json({ message: "Job created successfully", jobId: result.insertedId });
    } catch (e) {
        next(e);
    }
}

const updateJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const updatedFields = req.body;

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const client = getDatabase();
        const query = { _id: new ObjectId(jobId) };
        const updateQuery = { $set: updatedFields };

        const result = await client
            .db()
            .collection(dbCollections.JOBS)
            .updateOne(query, updateQuery);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.json({ message: "Job updated successfully" });
    } catch (e) {
        next(e);
    }
}

const deleteJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const client = getDatabase();
        const query = { _id: new ObjectId(jobId) };

        const result = await client
            .db()
            .collection(dbCollections.JOBS)
            .deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.json({ message: "Job deleted successfully" });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getJobsByCompany,
    getJobById,
    getJobs,
    createJob,
    updateJob,
    deleteJob
}