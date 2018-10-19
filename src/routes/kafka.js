//Here is where we declare the modules and shit we will need
const express = require('express');

//import the controllers and middleware
const { kafkaController} = require('../controllers/index');
const { catchErrors } = require('../middleware/error-handler');

//set up the router
const router = express.Router();

router.post('/', catchErrors(kafkaController.sendKafkaMessage));

module.exports = router;