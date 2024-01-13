const TestController = require('./controllers/test');

const router = require("express").Router();

router.get(
    "/api/test",
    TestController.test
);
  

module.exports = router;