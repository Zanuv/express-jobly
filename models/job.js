"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Model for Job. */

class Job {
	/** Create a new job in the database. */

	static async create({ title, salary, equity, companyHandle }) {
		const result = await db.query(
			`INSERT INTO jobs (title, salary, equity, company_handle)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
			[title, salary, equity, companyHandle]
		);
		return result.rows[0];
	}

	/** Retrieve all jobs from the database, optionally filtered by search criteria. */

	static async findAll(searchFilters = {}) {
		const { minSalary, hasEquity, title } = searchFilters;

		let whereConditions = [];
		let queryValues = [];

		if (minSalary !== undefined) {
			queryValues.push(minSalary);
			whereConditions.push(`salary >= $${queryValues.length}`);
		}

		if (hasEquity === true) {
			whereConditions.push(`equity > 0`);
		}

		if (title !== undefined) {
			queryValues.push(`%${title}%`);
			whereConditions.push(`title ILIKE $${queryValues.length}`);
		}

		const whereClause =
			whereConditions.length > 0
				? `WHERE ${whereConditions.join(" AND ")}`
				: "";

		const query = `
      SELECT j.id, j.title, j.salary, j.equity, j.company_handle AS "companyHandle", c.name AS "companyName"
      FROM jobs AS j
      LEFT JOIN companies AS c ON c.handle = j.company_handle
      ${whereClause}
      ORDER BY j.title
    `;

		const result = await db.query(query, queryValues);
		return result.rows;
	}

	/** Retrieve a specific job by ID, including its associated company information. */

	static async get(id) {
		const jobResult = await db.query(
			`SELECT j.id, j.title, j.salary, j.equity, j.company_handle AS "companyHandle", c.name, c.description, c.num_employees AS "numEmployees", c.logo_url AS "logoUrl"
     FROM jobs AS j
     LEFT JOIN companies AS c ON c.handle = j.company_handle
     WHERE j.id = $1`,
			[id]
		);

		const job = jobResult.rows[0];
		if (!job) throw new NotFoundError(`Job not found: ${id}`);

		// Parse the equity value to a number
		job.equity = Number(job.equity);

		return job;
	}

	/** Update a job in the database with the provided data. */

	static async update(id, data) {
		if (data.id || data.companyHandle) {
			throw new BadRequestError(
				"Updating job ID or company handle not allowed"
			);
		}

		const { setCols, values } = sqlForPartialUpdate(data, {});
		const idVarIdx = "$" + (values.length + 1);

		const querySql = `
      UPDATE jobs
      SET ${setCols}
      WHERE id = ${idVarIdx}
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;

		const result = await db.query(querySql, [...values, id]);
		const job = result.rows[0];

		if (!job) {
			throw new NotFoundError(`No job: ${id}`);
		}

		return job;
	}

	/** Remove a job from the database. */

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM jobs WHERE id = $1 RETURNING id`,
			[id]
		);

		if (result.rows.length === 0) {
			if (result.rows.length === 0) {
				throw new NotFoundError(`Job not found: ${id}`);
			}
		}
	}
}

module.exports = Job;
