const { ProtoFile } = require('../database/models');
const trunks = require('trunks-log');
const log = new trunks('GRPC');

exports.callService = async (req, res) => {
    req.toString();
    res.status(200);

    const request = req.body;

    const protoFileMongo = await ProtoFile.findById(request.protoFileId).exec();
    const protoFile = protoFileMongo._doc;

    protoFile.toString();
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