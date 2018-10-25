//bring in the seperate models
const ProtoObject = require('./ProtoObject');
const KafkaRequest = require('./KafkaRequest');
const GrpcRequest = require('./GrpcRequest');
//import other models in the same manner

//export em in a good ol' bundle 
module.exports = {
    ProtoObject,
    KafkaRequest,
    GrpcRequest
};