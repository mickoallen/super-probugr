const { ProtoObject } = require('../database/models');
const { GrpcRequest } = require('../database/models');
const trunks = require('trunks-log');
const log = new trunks('GRPC');
const GRPCClient = require('../middleware/GRPCClient');
const protobuf = require('protobufjs');
const moment = require('moment');

exports.callService = async (req, res) => {
    const request = req.body;

    saveRequest(request);

    //get filepath - ensure it is still a proto
    const protoFileMongo = await ProtoObject.findOne({'filename': request.filename}).exec();

    let messageBodyAsJson;
    try{
        messageBodyAsJson = JSON.parse(request.body);
    }catch (e) {
        log.error(e, "invalid json");
        res.status(500).json({status:"ERROR", message:"Invalid JSON"}).end();
        return;
    }

    const grpcClient = new GRPCClient(request.serverUrl, request.serviceName, protoFileMongo.filepath);

    grpcClient.invokeMethod(request.methodName, messageBodyAsJson, function (error, response) {
        if(error){
            log.error(error, "Error! " + error );
            res.json({"errorMessage":error}).status(500).end();
        }else{
            res.json({"success":"yay","message":response}).status(200).end();
        }
    });
};

exports.index = async (req, res) => {
    //query the DB of all proto files
    await ProtoFile.find().exec()
        .then(protoFiles => {
            log.success('Retrieved all {} proto files', protoFiles.length);
            res.json({ protoFiles: protoFiles});
        })
        .catch(err => {
            log.error(err, 'Could not retrieve protoFiles: {}', err.message);
            res.json({ error: err, message: "Could not retrieve protoFiles"}).status(500);
        })
};

async function saveRequest(requestBody){
    var now = new Date();
    requestBody.createdAtPretty = moment(now).format('llll');
    requestBody.createdAtRaw = now;

    var grpcRequest = await GrpcRequest.findOne(
        {
            body: requestBody.body,
            filename: requestBody.filename,
            serverUrl: requestBody.serverUrl,
            methodName: requestBody.methodName,
            serviceName: requestBody.serviceName
        }
    ).exec();

    if(grpcRequest){
        grpcRequest.$set('createdAtPretty', requestBody.createdAtPretty);
        grpcRequest.$set('createdAtRaw', requestBody.createdAtRaw);
    }else{
        grpcRequest = new GrpcRequest(requestBody);
    }

    grpcRequest.save()
        .then(savedRequest => {
            log.success("saved request: {}", savedRequest);
        }).catch(error => {
        log.error(error, "Failed to save request" + requestBody);
    });
}

exports.loadRequestHistory = async (req, res) => {
    await GrpcRequest.find().sort({createdAtRaw: -1}).exec()
        .then(grpcRequests => {
            log.success('Retrieved all {} grpc requests', grpcRequests.length);
            res.json({ grpcRequests: grpcRequests});
        })
        .catch(err => {
            log.error(err, 'Could not retrieve grpc requests: {}', err.message);
            res.json({ error: err, message: "Could not retrieve grpc requests"}).status(500);
        })
};

exports.clearHistory = async (req, res) => {
    await GrpcRequest.remove({}).exec()
        .then(request => {
            log.success('Clear grpc requests');
            res.json({});
        })
        .catch(err => {
            log.error(err, 'Could not clear grpc requests', err.message);
            res.json({}).status(500);
        });
};