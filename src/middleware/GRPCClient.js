const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

class GRPCClient{

    constructor(serverAddress, serviceName, protoFilePath) {
        const packageDefinition = GRPCClient.loadFromProtoFile(protoFilePath);

        this.serviceName = serviceName;
        this.methods = GRPCClient.extractMethods(this.serviceName, packageDefinition);
        this.client = GRPCClient.loadClient(this.serviceName, serverAddress, packageDefinition);
    }

    defaultCallback = (error, response) => {
        if (error) {
            console.error(error.message);
        }

        if (response) {
            console.log(response);
        }
    };

    /**
     * Invokes the specified method on a gRPC client.
     * Supports four types of methods:
     *  - simple (no streaming)
     *  - request streaming
     *  - response streaming
     *  - bidirectional streaming
     * @param {string} methodName
     * @param {object} request
     * @param callback if not specified, the default callback function will be used
     */
    invokeMethod(methodName, request, callback=null) {
        const method = this.getMethod(methodName);

        if (typeof callback !== 'function') {
            callback = this._defaultCallback;
        }

        if (method.requestStream && method.responseStream) {
            console.debug(`${methodName}: bidirectional streaming method invoked.`);
            this.invokeBidirectionalStreamMethod(methodName, request, callback)
        } else if (method.requestStream) {
            console.debug(`${methodName}: request streaming method invoked.`);
            this.invokeRequestStreamMethod(methodName, request, callback)
        } else if (method.responseStream) {
            console.debug(`${methodName}: response streaming method invoked.`);
            this.invokeResponseStreamMethod(methodName, request, callback)
        } else {
            console.debug(`${methodName}: simple method invoked.`);
            this.invokeSimpleMethod(methodName, request, callback)
        }
    }

    /**
     * Invokes a simple, no stream method
     * @param {string} methodName
     * @param {object} request
     * @param callback
     */
    invokeSimpleMethod(methodName, request, callback) {
        this.client[methodName](request, callback);
    }

    /**
     * Invokes a request stream method. Works with request object of the Array type.
     * @param {string} methodName
     * @param {object} request
     * @param callback
     */
    invokeRequestStreamMethod(methodName, request, callback) {
        const call = this.client[methodName](null, callback);

        if (request instanceof Array) {
            console.debug(`${methodName}: streaming requests from an Array.`);

            for (let r in request) {
                call.write(r);
            }
        } else {
            console.debug(`${methodName}: unrecognized request object type. Supported types are: Array`);
        }

        call.end();
    }

    invokeResponseStreamMethod(methodName, request, callback) {
        throw `${methodName}: response stream method invocation is not implemented.`;
    }

    invokeBidirectionalStreamMethod(methodName, request, callback) {
        throw `${methodName}: bidirectional stream method invocation is not implemented.`;
    }

    /**
     * Given the method's name return the method object, if exists.
     * @param {string} methodName
     * @returns {any}
     */
    getMethod(methodName) {
        const method = this.methods.filter(m => m.originalName === methodName)[0];

        if (!method) {
            throw `${this.serviceName}: method ${methodName} not found. Is it defined in the proto file?`
        }

        return method;
    }

    /**
     * Loads package definition from the specified file.
     * @param {string} path
     * @returns {object}
     */
    static loadFromProtoFile(path) {
        if (!fs.existsSync(path)) {
            throw `Proto file at ${path} not found.`;
        }

        // Options suggested by the gRPC authors.
        const options = {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        };

        return protoLoader.loadSync(path, options);
    }

    /**
     * Attempts to create a gRPC client for the given service name and server address.
     * @param {string} serviceName
     * @param {string} serverAddress
     * @param {object} packageDefinition
     * @returns {object}
     */
    static loadClient(serviceName, serverAddress, packageDefinition) {
        const grpcObject = grpc.loadPackageDefinition(packageDefinition);

        if (!grpcObject[serviceName]) {
            throw `Service not found: ${serviceName}. Is it defined in the proto file?`
        }

        const client = new grpc.Client[serviceName](serverAddress, grpc.credentials.createInsecure());

        if (!client) {
            throw `Couldn't connect to RPC server at ${serverAddress}. Is it running?`
        }

        return client;
    }

    /**
     * Extracts RPC methods from a package definition into an array.
     * @param {string} serviceName
     * @param {object} packageDefinition
     * @returns {any[]}
     */
    static extractMethods(serviceName, packageDefinition) {
        const serviceMethods = packageDefinition[serviceName];
        const methods = [];
        let index = 0;

        for (let method in serviceMethods) {
            methods[index++] = serviceMethods[method];
        }

        return methods
    }
}