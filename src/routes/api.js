/*
 * This file is used to build the API routes, we may have 
 * different routes for views and the like
 */

const express = require('express');

const userRoutes = require('./users'); //use the user route shit
const protoFileRoutes = require('./protoFiles');
const grpcRoutes = require('./grpc');
const kafkaRoutes = require('./kafka');
const router = express.Router(); //make a new router

router.use('/users', userRoutes); //tell it to use the userRoutes
router.use('/proto-files', protoFileRoutes);
router.use('/grpc', grpcRoutes);
router.use('/kafka', kafkaRoutes);

module.exports = router;