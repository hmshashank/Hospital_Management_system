const mysql = require("mysql")
const express = require("express")
const app = express()
var mysqlconnection = mysql.createConnection(
    {
        host: 'hospitalaws.cvoto69mhkki.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'BankLogin!3',
        database: 'dummy'
    }
);
module.exports = mysqlconnection

// mysql://ugpgztx7leeszzit:JyYlZ2HheQD5e8zt82Ho@by59qgkgtip5p358uwli-mysql.services.clever-cloud.com:3306/by59qgkgtip5p358uwli