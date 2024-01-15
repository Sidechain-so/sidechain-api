const TestController = require('./controllers/test');

const router = require("express").Router();

router.post(
    "/api/test",
    TestController.test
);
  

module.exports = router;