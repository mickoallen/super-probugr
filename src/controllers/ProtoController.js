const { ProtoObject } = require('../database/models');
const trunks = require('trunks-log');
const log = new trunks('PROTOFILES');
const ProtoFileHandler = require('../middleware/ProtoFileHandler');
const multer  = require('multer');
const fs = require('fs');

const baseProtoDirecotry = "/tmp/protos";
const baseUploadDirectory = "/tmp/uploads";

exports.upload = async (req, res) => {

    // const protoFileHandler = new ProtoFileHandler('/home/mick/MickProjects/super-probugr/test/test1.proto') ;

    const upload = multer({ dest: baseUploadDirectory }).single("file");
    let uploadedFilename = "";
    let originalFilename = "";

    upload(req, res, function (err) {
        if(err){
            return res.end("error uploading file");
        }
        console.log("File uploaded - " + req.file.filename);

        uploadedFilename = req.file.filename;
        originalFilename = req.file.originalname;

        fs.copyFileSync(baseUploadDirectory + "/" + uploadedFilename, baseProtoDirecotry + "/" + originalFilename);

        let protoFileHandler = new ProtoFileHandler(baseProtoDirecotry + "/" + originalFilename);
        let protoFileToCreate = new ProtoObject({
            filename: originalFilename,
            filepath : baseProtoDirecotry + "/" + originalFilename,
            messageNames: protoFileHandler.messageNames,
            serviceNames: protoFileHandler.services
        });

        protoFileToCreate.save()
            .then(protoFileToCreate => {
                return res.status(200).json({}).end()
            }).catch(error => {
                return res.status(500).json({}).end()
            });
    });
};

exports.delete = async (req, res) => {
    const request = req.body;
    const protoFileMongo = await ProtoObject.findOne({'filename': request.protofileName}).exec();
    await ProtoObject.findByIdAndRemove(protoFileMongo._id).exec()
        .then(protoFiles => {
            log.success('Deleted proto file');
            res.json().status(200).end();
        })
        .catch(err => {
            log.error(err, 'Could not delete proto files: {}', err.message);
            res.json({ error: err, message: "Could not delete proto files"}).status(500).end();
        })
};

exports.index = async (req, res) => {
    //query the DB of all proto files
    await ProtoObject.find().exec()
        .then(protoFiles => {
            log.success('Retrieved all {} proto files', protoFiles.length);
            res.json({ protoFiles: protoFiles});
        })
        .catch(err => {
            log.error(err, 'Could not retrieve protoFiles: {}', err.message);
            res.json({ error: err, message: "Could not retrieve protoFiles"}).status(500);
        })
};