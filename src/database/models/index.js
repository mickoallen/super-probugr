//bring in the seperate models
const User = require('./user');
const ProtoObject = require('./ProtoObject');
const KafkaRequest = require('./KafkaRequest');
const GrpcRequest = require('./GrpcRequest');
//import other models in the same manner

//export em in a good ol' bundle 
module.exports = {
    User,
    ProtoObject,
    KafkaRequest,
    GrpcRequest
};