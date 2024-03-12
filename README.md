# Issue Tracker
Issue Tracker
Build a full stack JavaScript app that is functionally similar to this: https://issue-tracker.freecodecamp.rocks/. Working on this project will involve you writing your code using one of the following methods:

Clone this GitHub repo and complete your project locally.
Use our Gitpod starter project to complete your project.
Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.
Complete the necessary routes in /routes/api.js
Create all of the functional tests in tests/2_functional-tests.js
Copy the sample.env file to .env and set the variables appropriately
To run the tests automatically, add NODE_ENV=test in your .env file
To run the tests in the console, use the command npm run test
Write the following tests in tests/2_functional-tests.js:

Create an issue with every field: POST request to /api/issues/{project}
Create an issue with only required fields: POST request to /api/issues/{project}
Create an issue with missing required fields: POST request to /api/issues/{project}
View issues on a project: GET request to /api/issues/{project}
View issues on a project with one filter: GET request to /api/issues/{project}
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}
Solution Link
ex: https://3000-project-url.gitpod.io/
Source Code Link
ex: https://your-git-repo.url/files
I've completed this challenge
Get a Hint
Ask for Help

/**
*
* Your test output will go here
*
*
*/
Tests
Waiting:You can provide your own project, not the example URL.
Waiting:You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
Waiting:The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
Waiting:If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
Waiting:You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
Waiting:You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
Waiting:You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
Waiting:When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.
Waiting:When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. On any other error, the return value is { error: 'could not update', '_id': _id }.
Waiting:You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue. If no _id is sent, the return value is { error: 'missing _id' }. On success, the return value is { result: 'successfully deleted', '_id': _id }. On failure, the return value is { error: 'could not delete', '_id': _id }.
Waiting:All 14 functional tests are complete and passing.

