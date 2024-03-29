const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
//const { query } = require("express");

chai.use(chaiHttp);

let issue1;
let issue2;

suite("Functional Tests", function () {
  suite("POST /api/issues/{project} => object with issue data", function () {
    test("All fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Issue 1",
          issue_text: "Functional Test",
          created_by: "FCC",
          assigned_to: "Dom",
          status_text: "Not Done",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          issue1 = res.body;
          assert.equal(res.body.issue_title, "Issue 1");
          assert.equal(res.body.issue_text, "Functional Test");
          assert.equal(res.body.created_by, "FCC");
          assert.equal(res.body.assigned_to, "Dom");
          assert.equal(res.body.status_text, "Not Done");
          assert.equal(res.body.project, "test");          
          done();
        });
    }).timeout(10000);

    test("Required fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue 2",
          issue_text: "Functional Test",
          created_by: "FCC",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Issue 2");
          issue2 = res.body;
          assert.equal(res.body.issue_text, "Functional Test");
          assert.equal(res.body.created_by, "FCC");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.project, "test");          
          done();
        });
    }).timeout(5000);

    test("Missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .set("content-type", "application/json")
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "FCC",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });

    suite("GET requests", function () {
      test("Array of issues on a specific project", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });

      test("View issues on a project with one filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({
            _id: issue1._id,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_title, issue1.issue_title);
            assert.equal(res.body[0].issue_text, issue1.issue_text);
            done();
          });
      });

      test("View issues on a project with multiple filters", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({
            issue_title: issue1.issue_title,
            issue_text: issue1.issue_text,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_title, issue1.issue_title);
            assert.equal(res.body[0].issue_text, issue1.issue_text);
            done();
          });
      });
    });

    suite("PUT requests", function () {
      test("Update one field on an issue", function (done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: issue1._id,
            issue_title: "different",
            issue_text: "second field"
          })
          .end(function (err, res) {            
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, issue1._id);
            done();
          });
      });

      test("Update one or more fields on an issue", function (done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: issue1._id,
            issue_title: "random",
            issue_text: "code error in test",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, issue1._id);
            done();
          });
      });

      test("Update an issue with missing _id", function (done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            issue_title: "update",
            issue_text: "update",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });

      test("Update an issue with no fields to update", function (done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: issue1._id,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            done();
          });
      });

      test("Update an issue with an invalid _id", function (done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: "65deeF09735021ef9b6c31f5",
            issue_title: "update",
            issue_text: "update",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            done();
          });
      });
    });

    suite("DELETE requests", function () {
      test("Delete an issue: DELETE request to api/issues/test", function (done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({ _id: issue1._id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
          });
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({ _id: issue2._id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
      });

      test("Delete an issue with an invalid _id DELETE request", function (done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({
            _id: issue1._id,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");
            done();
          });
      });

      test("Delete an issue with missing _id DELETE ", function (done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
    });
  });
});