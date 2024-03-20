require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT;

const { mongoConnect } = require('./config/mongodb-config')

const routers = require('./router');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// mongodb connect
mongoConnect();

// enable cors
app.use(cors({
    origin: "*"
}));

// enable routers
app.use(routers);

// server initialization
http.createServer(app).listen("sidechain-api.vercel.app", () => {
    console.log(`Server started at port ${'sidechain-api.vercel.app'}`)
})

module.exports = app;
