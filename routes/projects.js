var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Project = require("../models/Project");

/* GET home page. */
router.get("/", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

router.post("/", (req, res, next) => {
  const { title, description } = req.body;

  Project.create({ title, description, tasks: [] })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

router.get("/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has a `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Project.findById(projectId)
    .populate("tasks")
    .then((project) => res.status(200).json(project))
    .catch((error) => res.json(error));
});

router.put("/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((updatedProject) => {
        return updatedProject.populate('tasks')
    })
    .then((populated) => {
        res.json(populated)
    })
    .catch((error) => res.json(error));
});

router.delete("/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then((deleted) =>
      res.json({
        deleted,
        message: `Project with ${projectId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
