"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");
const companySearchSchema = require("../schemas/companySearch.json");

const router = new express.Router();

/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, companyNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const company = await Company.create(req.body);
		return res.status(201).json({ company });
	} catch (err) {
		return next(err);
	}
});

/** GET /companies =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Search filters:
 * - name (find by company name, case-insensitive, partial matches)
 * - minEmployees (find companies with at least that number of employees)
 * - maxEmployees (find companies with no more than that number of employees)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
	try {
		// Get the query parameters from the request
		const { name, minEmployees, maxEmployees } = req.query;

		// Convert minEmployees and maxEmployees to integers
		const query = {
			name,
			minEmployees: minEmployees && parseInt(minEmployees),
			maxEmployees: maxEmployees && parseInt(maxEmployees),
		};

		// Validate the query against the company search schema
		const validator = jsonschema.validate(query, companySearchSchema);
		if (!validator.valid) {
			// If the query is not valid, throw a BadRequestError with the validation errors
			const errors = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errors);
		}

		// Find companies matching the query
		const companies = await Company.findAll(query);

		// Return the list of companies as a JSON response
		return res.json({ companies });
	} catch (err) {
		// Pass any errors to the error handler middleware
		return next(err);
	}
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
	try {
		const company = await Company.get(req.params.handle);
		return res.json({ company });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, companyUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const company = await Company.update(req.params.handle, req.body);
		return res.json({ company });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
	try {
		await Company.remove(req.params.handle);
		return res.json({ deleted: req.params.handle });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
