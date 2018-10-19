const { ProtoObject } = require('../database/models');
const trunks = require('trunks-log');
const log = new trunks('KAFKA');
const protobuf = require('protobufjs');
const kafka = require('node-rdkafka');

exports.sendKafkaMessage = async (req, res) => {
    let errorMessage = validateRequest(req,res);
    if(errorMessage){
        res.status(500).json({status:"ERROR", message: errorMessage}).end();
        return
    }

    const request = req.body;

    //get the proto file
    const protoFileMongo = await ProtoObject.findOne({'filename': request.filename}).exec();

    const root = protobuf.loadSync(protoFileMongo.filepath);
    const messageDefinition = root.lookupType(request.messageName);
    let messageBodyAsJson;
    try{
        messageBodyAsJson = JSON.parse(request.body);
    }catch (e) {
        log.error(e, "invalid json");
        res.status(500).json({status:"ERROR", message:"Invalid JSON"}).end();
        return;
    }

    const encodedProto = messageDefinition.encode(messageBodyAsJson).finish();

    const stream = kafka.createWriteStream({
        "metadata.broker.list": request.kafkaServerUrl
    }, {}, {
        topic: request.topic
    });

    stream.write(encodedProto, (err) => {
        if (err) {
            console.log(err);
        }
        log.info("Message sent!");
    });

    stream.on("error", (err) => {
        log.error(err, "Error in our kafka stream");
        res.status(500).json({status:"ERROR", message: err.message}).end();
    });

    stream.close(() => {
        res.status(200).end();
    });
};

function validateRequest(req) {
    const request = req.body;

    let errorMessage = "";

    if(!request.filename){
        errorMessage = "You must select a proto file. ";
    }
    if(!request.messageName){
        errorMessage = errorMessage + "You must select a message. ";
    }
    if(!request.kafkaServerUrl){
        errorMessage = errorMessage + "You must specify a Kafka server url. ";
    }
    if(!request.topic){
        errorMessage = errorMessage + "You must specify a topic. ";
    }
    if(!request.body){
        errorMessage = errorMessage + "You must specify a valid JSON for the message body. ";
    }

    return errorMessage;
}