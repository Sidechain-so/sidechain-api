const { getDatabase } = require("../config/mongodb-config");
const { ObjectId } = require("mongodb");
const { dbCollections } = require("../helpers/constants");

const getBountiesByCompany = async (companyId) => {
    const client = getDatabase();

    const query = { companyId: new ObjectId(companyId) };
        
    const bounties = await client.db()
        .collection(dbCollections.BOUNTIES)
        .find(query)
        .toArray();

    return bounties;
}

const getBountyById = async (req, res, next) => {
    try {
        const { bountyId } = req.params;
        const client = getDatabase();
        
        const query = { _id: new ObjectId(bountyId) };
        
        const bounty = await client.db().collection(dbCollections.BOUNTIES).findOne(query);
        if (!bounty) {
            return res.status(404).json({ message: "Bounty not found" });
        }

        return res.json(bounty);
    } catch (e) {
        next(e);
    }
}

const getBounties = async () => {
    try {
        const client = getDatabase();
        const data = await client.db().collection(dbCollections.BOUNTIES).find().toArray();
        return res.json(data);
    } catch (e) {
        next(e);    
    }
}

const getBountiesByCandidate = async (candidateId) => {
    const client = getDatabase();

    const query = { candidateId: new ObjectId(candidateId) };
        
    const bounties = await client.db()
        .collection(dbCollections.BOUNTIES)
        .find(query)
        .toArray();

    return bounties;
}

const createBounty = async (req, res, next) => {
    try {
        const { 
            bountyName, 
            tags, 
            price, 
            companyId
        } = req.body;
        
        if (
            !bountyName || 
            !tags || 
            !price || 
            !companyId
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const client = getDatabase();
        
        const result = await client.db().collection(dbCollections.BOUNTIES).insertOne({
            bountyName, 
            tags, 
            price, 
            companyId
        });

        return res.status(201).json({ message: "Bounty created successfully", bountyId: result.insertedId });
    } catch (e) {
        next(e);
    }
}

const updateBounty = async (req, res, next) => {
    try {
        const { bountyId } = req.params;
        const updatedFields = req.body;

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const client = getDatabase();
        const query = { _id: new ObjectId(bountyId) };
        const updateQuery = { $set: updatedFields };

        const result = await client
            .db()
            .collection(dbCollections.BOUNTIES)
            .updateOne(query, updateQuery);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Bounty not found" });
        }

        return res.json({ message: "Bounty updated successfully" });
    } catch (e) {
        next(e);
    }
}

const deleteBounty = async (req, res, next) => {
    try {
        const { bountyId } = req.params;

        const client = getDatabase();
        const query = { _id: new ObjectId(bountyId) };

        const result = await client
            .db()
            .collection(dbCollections.BOUNTIES)
            .deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Bounty not found" });
        }

        return res.json({ message: "Bounty deleted successfully" });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getBountiesByCompany,
    getBountiesByCandidate,
    getBountyById,
    getBounties,
    createBounty,
    updateBounty,
    deleteBounty
}