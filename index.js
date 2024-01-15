require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();

const port = process.env.PORT;

const { mongoConnect } = require('./config/mongodb-config')

const routers = require('./router');

// mongodb connect
mongoConnect();

// enable cors
app.use(cors({
    origin: "*"
}));

// enable routers
app.use(routers);

// server initialization
http.createServer(app).listen(port, () => {
    console.log(`Server started at port ${port}`)
})

module.exports = app;