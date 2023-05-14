"use strict";

/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

db = new Client({
	host: "/var/run/postgresql/",
	database: getDatabaseUri(),
});

db.connect();

module.exports = db;
