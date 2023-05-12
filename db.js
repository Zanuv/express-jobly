"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
	db = new Client({
		host: "/var/run/postgresql/",
		database: "jobly",
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	db = new Client({
		host: "/var/run/postgresql/",
		database: "jobly_test",
	});
}

db.connect();

module.exports = db;
