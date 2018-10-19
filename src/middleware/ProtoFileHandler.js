const grpc = require('grpc');
const inspect = require('grpc-inspect');

class ProtoFileReader{
    constructor(filepath){
        const grpcObject = grpc.load(filepath);
        const descriptor = inspect(grpcObject);

        this.filepath = filepath;
        this.grpcObject = grpcObject;
        this.descriptor = descriptor;
        this.messageNames = this.getProtoMessages();
        this.services = this.getProtoServices();
    }

    // gets the service object from proto descriptor
    getProtoServices() {
        const namespaces = this.descriptor.namespaces;

        const definition = Object.values(namespaces)[0];
        return Object.values(definition.services);
    }

    getProtoMessages(){
        const namespaceDefinition = Object.values(this.descriptor.namespaces)[0];
        return Object.values(namespaceDefinition.messages);
    }
}

module.exports = ProtoFileReader;