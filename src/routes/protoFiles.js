//Here is where we declare the modules and shit we will need
const express = require('express');

//import the controllers and middleware
const { protoFileController} = require('../controllers/index');
const { catchErrors } = require('../middleware/error-handler');

//set up the router
const router = express.Router();

//get all proto objects
router.get('/', catchErrors(protoFileController.index));

//get all proto objects
router.get('/init', catchErrors(protoFileController.init));

router.post('/upload', catchErrors(protoFileController.upload));

router.post('/delete', catchErrors(protoFileController.delete));
//
// //make a new boy
// router.post('/', catchErrors(usersController.store));
//
// //see one boy
// router.get('/:id', catchErrors(usersController.show));
//
// //get rid of a boy
// router.delete('/:id', catchErrors(usersController.delete));
//
// //update a boy
// router.put('/:id', catchErrors(usersController.update));

module.exports = router;