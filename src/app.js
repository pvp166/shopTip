require('module-alias/register')
require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const {default: helmet} = require('helmet'); 
const app = express();

require('@src/dbs/init.mongodb');
const { checkOverload } = require('@src/helpers/check.connect');
checkOverload();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use('', require('@src/routes'));

app.use((req,res,next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})
app.use((error, req,res,next) =>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app;