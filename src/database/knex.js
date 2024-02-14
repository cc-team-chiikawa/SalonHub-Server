const environment = "development";
const config = require("../../knexfile.js")[environment];
const db = require("knex")(config);

module.exports = db;
