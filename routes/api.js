"use strict";
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Connect mongoose to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  });

// mongoose  issueSchema
const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  open: Boolean,
  status_text: String,
  project: String,
});

// Define the issue model
const Issue = mongoose.model("Issue", issueSchema);

// mongoose schema
const projectSchema = new Schema({
  project: { type: String },
});

// project model
const Project = mongoose.model("Project", projectSchema);

module.exports = { Issue, Project };

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async function (req, res) {
      const project = req.params.project;
      const filterObject = Object.assign(req.query);
      filterObject["project"] = project;      
      await Issue.find(filterObject)
        .then((arrayOfResults) => {          
          return res.json(arrayOfResults);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Internal server  error" });
        });
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      if (!(await Project.exists({ project: project }))) {
        try {
          let newProject = new Project({ project: project });
          await newProject.save();
        } catch (error) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        }
      }
      try {
        // create new issue
        let newIssue = new Issue({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: new Date().toUTCString(),
          updated_on: new Date().toUTCString(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          open: true,
          status_text: req.body.status_text || "",
          project: project,
        });
        // Save the new issue
        await newIssue.save();
        // respond with saved issue
        return res.json(newIssue);
      } catch (error) {
        // Handle errors
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .put(async function (req, res) {
      const project = req.params.project;
      console.log("req.params*** ",req.params)
      let id = req.body._id;
        
      if (!id) {
        res.json({ error: "missing _id" });
        return;
      }
      const updateObject = {};
      Object.keys(req.body).forEach(function (key) {
        if (req.body[key] != "") {
          updateObject[key] = req.body[key];
        }
      });
      
      if (Object.keys(updateObject).length < 2) {
        return res.json({ error: "no update field(s) sent", _id: id });
      }      
      
      try {
        updateObject.updated_on = new Date().toUTCString();        
        let doc = await Issue.findOneAndUpdate({ _id: id }, updateObject, {
          new: true,
        });
      // add code below the line
        if (!doc) {
          return res.json({ error: "could not update", _id: id });
        }
        return res.json({ result: "successfully updated", _id: id });
      // add code above this line  
      } catch (error) {
        return res.json({ error: "could not update", _id: id });
      }
      //return res.json({ result: "successfully updated", _id: id });
    })

    .delete(async function (req, res) {
      const { projectname } = req.params
      // set _id = ""; when testing for a missing _id
      let { _id } = req.body;      
      // Checkthat _id is provided
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      try {
        // Delete the issue from database
        const deletedIssue = await Issue.findByIdAndDelete(_id );
        //Check that issue was found and deleted
        if (!deletedIssue) {
          return res.json({ error: "could not delete", _id: _id });
        }
        // Issue successfully deleted
        return res.json({ result: "successfully deleted", _id: _id });
      } catch (error) {
        // server error
        return res.json({ error: "internal server error", _id: _id });
      } 
    });
}