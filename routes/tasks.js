var express = require('express');
var router = express.Router();

const Task = require('../models/Task')
const Project = require('../models/Project')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post("/", (req, res, next) => {
  const { title, description, projectId } = req.body;
 
  Task.create({ title, description, project: projectId })
    .then((newTask) => {
      return Project.findByIdAndUpdate(
        projectId, 
        { $push: { tasks: newTask._id } },
        { new: true} )
    })
    .then((response) => {
      return response.populate('tasks')
    })
    .then((response) => {
      res.json(response)
    })
    .catch(err => res.json(err));
});

module.exports = router;