//Here we will import all our controllers, this way we only need to
//import the controller as a single module, or an explicit constant later!!!
const protoFileController = require('./ProtoController');
const grpcController = require('./GrpcController');
const kafkaController = require('./KafkaController');

module.exports = { 
    protoFileController,
    grpcController,
    kafkaController
};