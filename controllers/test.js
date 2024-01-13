const { getDatabase } = require("../config/mongodb-config");

class TestController {
    static async test(req, res, next) {
        try {
            const client = getDatabase();
            const data = await client.db().collection('users').find().toArray();

            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = TestController;
