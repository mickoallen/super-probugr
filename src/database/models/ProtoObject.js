//import mongoose, our ODM for mongoDB
const mongoose = require('mongoose');

//Define all of its fields, like columns of a SQL table
const definition = {
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    messageNames: {
        type:Array,
        required: false
    },
    serviceNames: {
        type:Array,
        required: false
    }
};

//make the schema as a new instance of a mongoose schema, using our definition and options
const protoObject = new mongoose.Schema(definition);

//export that boye
module.exports = mongoose.model('ProtoObject', protoObject);