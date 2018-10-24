//import mongoose, our ODM for mongoDB
const mongoose = require('mongoose');

//Define all of its fields, like columns of a SQL table
const definition = {
};

//make the schema as a new instance of a mongoose schema, using our definition and options
const grpcRequest = new mongoose.Schema(definition, {strict: false});

//export that boye
module.exports = mongoose.model('GrpcRequest', grpcRequest);