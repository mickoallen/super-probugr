const { ProtoObject } = require('../database/models');
const { KafkaRequest } = require('../database/models');
const trunks = require('trunks-log');
const log = new trunks('KAFKA');
const protobuf = require('protobufjs');
const kafka = require('node-rdkafka');
const moment = require('moment');

exports.sendKafkaMessage = async (req, res) => {
    let errorMessage = validateRequest(req,res);
    if(errorMessage){
        res.status(500).json({status:"ERROR", message: errorMessage}).end();
        return
    }

    const request = req.body;
    await saveRequest(request);

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

exports.loadRequestHistory = async (req, res) => {
    await KafkaRequest.find().sort({createdAtRaw: -1}).exec()
        .then(kafkaRequests => {
            log.success('Retrieved all {} kafka requests', kafkaRequests.length);
            res.json({ kafkaRequests: kafkaRequests});
        })
        .catch(err => {
            log.error(err, 'Could not retrieve kafkaRequests: {}', err.message);
            res.json({ error: err, message: "Could not retrieve kafkaRequests"}).status(500);
        })
};

exports.clearHistory = async (req, res) => {
    await KafkaRequest.remove({}).exec()
        .then(request => {
            log.success('Clear kafka requests');
            res.json({});
        })
        .catch(err => {
            log.error(err, 'Could not clear kafkaRequests', err.message);
            res.json({}).status(500);
        });
}

async function saveRequest(requestBody) {
    var now = new Date();
    requestBody.createdAtPretty = moment(now).format('llll');
    requestBody.createdAtRaw = now;

    var kafkaRequest = await KafkaRequest.findOne(
        {
            body: requestBody.body,
            filename: requestBody.filename,
            kafkaServerUrl: requestBody.kafkaServerUrl,
            messageName: requestBody.messageName,
            topic: requestBody.topic
        }
    ).exec();

    //if it is an existing request just updated the date
    if(kafkaRequest){
        kafkaRequest.$set('createdAtPretty', requestBody.createdAtPretty);
        kafkaRequest.$set('createdAtRaw', requestBody.createdAtRaw);
    }else{
        kafkaRequest = new KafkaRequest(requestBody);
    }

    kafkaRequest.save()
        .then(savedRequest => {
            log.success("saved request: {}", savedRequest);
        }).catch(error => {
        log.error(error, "Failed to save request" + requestBody);
    });
}

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