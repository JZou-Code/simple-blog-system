const mariadb = require("mariadb");

require('dotenv').config()

const HOST = process.env.DB_HOST
const USER_NAME = process.env.DB_USER;
const USER_DB = process.env.DB_DATABASE;
const USER_PASS = process.env.DB_PASSWORD;

const database = mariadb.createConnection({
    host: HOST,
    database: USER_DB,
    user: USER_NAME,
    password: USER_PASS,
    timezone:'Z',
    dateStrings:true,
    initSql: "SET time_zone = '+00:00'"
});

module.exports = database;
