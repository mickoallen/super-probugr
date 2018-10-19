//Here we will import all our controllers, this way we only need to
//import the controller as a single module, or an explicit constant later!!!
const usersController = require('./users');
const protoFileController = require('./ProtoController');
const grpcController = require('./GrpcController');
const kafkaController = require('./KafkaController');

module.exports = { 
    usersController,
    protoFileController,
    grpcController,
    kafkaController
};