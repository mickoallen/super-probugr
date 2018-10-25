/*
 * This file is used to build the API routes, we may have 
 * different routes for views and the like
 */

const express = require('express');

const protoFileRoutes = require('./protoFiles');
const grpcRoutes = require('./grpc');
const kafkaRoutes = require('./kafka');
const router = express.Router(); //make a new router

router.use('/proto-files', protoFileRoutes);
router.use('/grpc', grpcRoutes);
router.use('/kafka', kafkaRoutes);

module.exports = router;