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

## Part Four: Jobs

Add a feature for jobs to the application.

### Research!

Our database uses the NUMERIC field type. Do some research on why we chose this, rather than a FLOAT type. Discover what the pg library returns when that field type is queried, and form a theory on why.

### Adding Job Model, Routes, and Tests

- Add a model for jobs — you can pattern-match this from the companies model.
- Updating a job should never change the ID of a job, nor the company associated with a job.
- Write tests for the model.
- Add routes for jobs. The same routes should be handled as we did for companies (for now, omit the special filtering on the GET / route), with the same security requirements (anyone can get the jobs, but only admins can add, update, or delete them). Make sure you suitably validate incoming data.
- Write tests for the routes.

### Adding Filtering

Similar to the companies filtering for the GET / route, add filtering for jobs for the following possible filters:

- title: filter by job title. Like before, this should be a case-insensitive, matches-any-part-of-string search.
- minSalary: filter to jobs with at least that salary.
- hasEquity: if true, filter to jobs that provide a non-zero amount of equity. If false or not included in the filtering, list all jobs regardless of equity.

Write comprehensive tests for this, and document this feature well.

### Show Jobs for a Company

Now that the app includes jobs, change the GET /companies/:handle feature so that it includes all of the information about the jobs associated with that company:


This is the Express backend for Jobly, version 2.

To run this:

    node server.js
    
To run the tests:

    jest -i
