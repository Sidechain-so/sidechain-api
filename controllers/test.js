const { getDatabase } = require("../config/mongodb-config");

class TestController {
    static async test(req, res, next) {
        try {
            console.log(req)
            // const client = getDatabase();
            // const data = await client.db().collection('users').find().toArray();

            return res.json(true);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = TestController;
