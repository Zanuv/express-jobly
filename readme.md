# Jobly Backend

## Part One: Setup / Starter Code

- Download the starter code. Do a quick skim of the code to get a sense of the main components and the organization.
- Set up the provided `jobly.sql` database and test database.
- Read the tests and get an understanding of what the `beforeEach` and `afterEach` methods are doing.
- Run the tests with coverage using the `-i` flag for Jest.
- Start up the server on port 3001.
- Test the API in Insomnia.

### First Task: `sqlForPartialUpdate`

- Write unit tests for `sqlForPartialUpdate`.
- Thoroughly document the function.


## Part Two: Companies

We’ve provided a model and routes for companies.

### Adding Filtering

The route for listing all companies (`GET /companies`) works, but it currently shows all companies. Add a new feature to this, allowing API users to filter the results based on optional filtering criteria, any or all of which can be passed in the query string:

- `name`: filter by company name: if the string “net” is passed in, this should find any company whose name contains the word “net”, case-insensitive (so “Study Networks” should be included).
- `minEmployees`: filter to companies that have at least that number of employees.
- `maxEmployees`: filter to companies that have no more than that number of employees.

If the `minEmployees` parameter is greater than the `maxEmployees` parameter, respond with a 400 error with an appropriate message.

Some requirements:

- Do not solve this by issuing a more complex SELECT statement than is needed (for example, if the user isn’t filtering by `minEmployees` or `maxEmployees`, the SELECT statement should not include anything about the `num_employees`).
- Validate that the request does not contain inappropriate other filtering fields in the route. Do the actual filtering in the model.
- Write unit tests for the model that exercise this in different ways, so you can be assured different combinations of filtering will work.
- Write tests for the route that will ensure that it correctly validates the incoming request and uses the model method properly.
- Document all new code here clearly; this is functionality that future team members should be able to understand how to use from your docstrings.

## Part Three: Change Authorization

### Companies

Retrieving the list of companies or information about a company should remain open to everyone, including anonymous users. Creating, updating, and deleting companies should only be possible for users who logged in with an account that has the is_admin flag in the database.

Find a way to do this where you don’t need to change the code of these routes, and where you don’t need to SELECT information about the user on every request, but that the authentication credentials provided by the user can contain information suitable for this requirement. Update tests to demonstrate that these security changes are working.

### Users

Creating users should only permitted by admins (registration, however, should remain open to everyone). Getting the list of all users should only be permitted by admins. Getting information on a user, updating, or deleting a user should only be permitted either by an admin, or by that user.

As before, write tests for this carefully.



This is the Express backend for Jobly, version 2.

To run this:

    node server.js
    
To run the tests:

    jest -i
