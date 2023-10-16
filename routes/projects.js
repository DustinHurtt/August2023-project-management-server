var express = require('express');
var router = express.Router();

const Project = require('../models/Project')

/* GET home page. */
router.get('/', (req, res, next) => {

});

router.post("/", (req, res, next) => {
    const { title, description } = req.body;
   
    Project.create({ title, description, tasks: [] })
      .then((response) => {

            res.json(response)
            
        })
      .catch((err) => {
        console.log(err)
        res.json(err)
        next(err)
    });
  });

module.exports = router;