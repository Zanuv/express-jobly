/**
 * Generate the SET clause and values for a SQL UPDATE statement based on the given dataToUpdate and jsToSql.
 *
 * @param {object} dataToUpdate - The object containing the data to update.
 * @param {object} jsToSql - The object mapping JavaScript property names to SQL column names.
 * @returns {object} An object containing the SET clause and values to use in an SQL UPDATE statement.
 * @throws {BadRequestError} If dataToUpdate is empty.
 *
 * @example
 * sqlForPartialUpdate({ firstName: 'John', age: 30 }, { firstName: 'first_name' });
 * // returns { setCols: '"first_name"=$1, "age"=$2', values: ['John', 30] }
 */

const { sqlForPartialUpdate, BadRequestError } = require("../helpers/sql");

describe("sqlForPartialUpdate", () => {
	test("should generate correct SQL statement and values when given dataToUpdate and jsToSql", () => {
		const dataToUpdate = { firstName: "John", age: 30 };
		const jsToSql = { firstName: "first_name" };
		const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
		expect(result).toEqual({
			setCols: '"first_name"=$1, "age"=$2',
			values: ["John", 30],
		});
	});

	test("should throw BadRequestError when dataToUpdate is empty", () => {
		const dataToUpdate = {};
		const jsToSql = {};
		expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(
			BadRequestError
		);
	});

	test("should generate correct SQL statement and values when jsToSql is empty", () => {
		const dataToUpdate = { firstName: "John", age: 30 };
		const jsToSql = {};
		const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
		expect(result).toEqual({
			setCols: '"firstName"=$1, "age"=$2',
			values: ["John", 30],
		});
	});

	// Add more tests to cover edge cases and different inputs
});
