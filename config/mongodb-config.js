const { MongoClient } = require('mongodb');

let database = null;
let client = null;

const mongoConnect = async () => {
    try {
        const uri = process.env.MONGODB_URL;
        client = new MongoClient(uri);

        await client.connect();

        const db = client.db(process.env.MONGODB_DBNAME);
        database = db;

        return db;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    mongoConnect,
    getDatabase() {
        if (!client) {
            throw new Error('MongoDB client not connected');
        }

        return client;
    },
};
