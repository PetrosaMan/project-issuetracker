const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let id1 = "";
let id2 = "";
let id3 = "";
let id4 = "";
let id5 = "";

suite("Functional Tests", function () {
  suite("POST /api/issues/{project} => object with issue data", function () {
    test("All fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 1",
          issue_text: "text",
          created_by: "Functional Test - All fields filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In testing",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title 1");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - All fields filled in",
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In testing");
          assert.equal(res.body.project, "test");
          id1 = res.body._id;
          console.log("id1 has been set as " + id1);
          done();
        });
    });

    test("Required fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 2",
          issue_text: "text",
          created_by: "Functional Test - Required fields filled in",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title 2");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Required fields filled in",
          );
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.project, "test");
          id2 = res.body._id;
          console.log("id2 has been set as " + id2);
          done();
        });
    });

    test("Missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 3",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          id3 = res.body._id;
          console.log("id3 has been set as " + id3);
          done();
        });
    });

    suite("GET requests", function () {
      test("Array of issues on a specific project", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .end(function (err, res) {
            assert.isArray(res.body, "body is an array");
            assert.isObject(res.body[0], "body contains an object");
            id4 = res.body._id;
            console.log("id4 has been set as " + id4);
            done();
          });
      });

      test("View issues on a project with one filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ created_by: "Fred Blogs" })
          .end(function (err, res) {
            console.log("Response Body", res.body); // log the response body
            assert.isArray(res.body, "body is an array");
            assert.isObject(res.body[0], "body contains an object");
            for (const issue of res.body) {
              assert.include(issue, { created_by: "Fred Blogs" });
            }
            id5 = res.body._id;
            console.log("id5 has been set as " + id5);
            done();
          });
      });
    });
    // test go above this line
  });
});
