const { BadRequestError } = require("../expressError");

/**
 * Generate the SQL statement and values to update a row in a database table using a partial update.
 *
 * @param {Object} dataToUpdate - An object containing the fields and values to update.
 * @param {Object} jsToSql - An object that maps the JavaScript-style column names to their corresponding names in the database.
 * @returns {Object} An object with two properties: setCols (the SQL statement to set the updated columns) and values (an array of the values to set).
 * @throws {BadRequestError} If dataToUpdate is empty.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
	const keys = Object.keys(dataToUpdate);
	if (keys.length === 0) throw new BadRequestError("No data");

	// {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
	const cols = keys.map(
		(colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
	);

	return {
		setCols: cols.join(", "),
		values: Object.values(dataToUpdate),
	};
}

module.exports = { sqlForPartialUpdate };
