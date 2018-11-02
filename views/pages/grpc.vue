<template>

    <v-container class="pa-0">
        <v-container grid-list-md>
            <template>
                <v-layout>
                    <v-flex xs8>
                        <v-card>
                            <v-toolbar class="primary primaryText--text">
                                <v-toolbar-title>gRPC</v-toolbar-title>
                            </v-toolbar>
                            <v-container fluid>
                                <v-card-text>
                                    <v-form ref="form">
                                        <v-text-field label="Server URL" v-model="serverUrl"> </v-text-field>
                                        <v-select v-model="selectedProtoFilename" :items="protoFilenames" :hint="`Proto file`" persistent-hint @change="changedProtofile"></v-select>
                                        <v-select v-model="selectedServiceName" :items="serviceNames" :hint="`Service name`" persistent-hint @change="changedServiceName"></v-select>
                                        <v-select v-model="selectedMethodName" :items="methodNames" :hint="`Method name`" persistent-hint @change="changedMethodName"></v-select>
                                        <br />
                                        <v-label>Request message model: {{requestMessageModel}}</v-label>
                                        <v-textarea label="Message Body" v-model="messageBody" autoGrow  ></v-textarea>
                                    </v-form>
                                    <br />
                                    <v-btn @click="sendMessage()" block :disabled="disableSendMessageButton()" :loading="!messageSent">Send message</v-btn>
                                </v-card-text>
                            </v-container>
                        </v-card>
                        <br />
                        <v-card>
                            <v-container fluid>
                                <v-btn block @click="clearLog()">Clear log</v-btn>
                                <span  v-if="responseLog.length">
                                    <v-label v-for="logItem in responseLog">
                                        {{logItem}}
                                        <br />
                                    </v-label>
                                </span>
                            </v-container>
                        </v-card>
                    </v-flex>

                    <v-flex fluid>
                        <v-card>
                            <v-toolbar class="primary primaryText--text">
                                <v-toolbar-title>History</v-toolbar-title>
                            </v-toolbar>
                            <v-container fluid>
                                <v-btn @click="clearHistory()" block>Clear history</v-btn>
                                <span  v-if="requestHistory.length">
                                    <v-flex v-for="historyItem in requestHistory">
                                        <v-expansion-panel>
                                            <v-expansion-panel-content>
                                                <div slot="header">{{historyItem.methodName}}<br />{{historyItem.createdAtPretty}}</div>
                                                <v-container grid-list-md text-xs-center>
                                                    <v-layout row>
                                                            <v-flex xs-6 class="text-xs-left">
                                                                <v-btn block @click="applyHistoryItem(historyItem)">Apply</v-btn>
                                                                <v-spacer></v-spacer>
                                                                <v-label>
                                                                    Server URL: {{historyItem.serverUrl}}
                                                                    <br />
                                                                    Proto file: {{historyItem.filename}}
                                                                    <br />
                                                                    Service Name: {{historyItem.serviceName}}
                                                                    <br />
                                                                    Method Name: {{historyItem.methodName}}
                                                                </v-label>
                                                                <v-textarea label="Message Body" v-model="historyItem.body" readonly></v-textarea>
                                                            </v-flex>

                                                    </v-layout>
                                                </v-container>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-flex>
                                </span>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </template>
        </v-container>
    </v-container>
</template>

<script>
    import { http } from "../config/http.js"

    export default {
        data: () => ({
            serverUrl: "",
            protoFiles: [],
            protoFilenames: [],
            serviceNames: [],
            methodNames:[],
            methods: [],

            selectedProtoFilename: "",
            selectedServiceName: "",
            selectedMethodName: "",

            requestMessageModel: "",
            responseMessageModel: "",

            messageBody: "",
            responseLog:[],
            messageSent: true,
            requestHistory: []
        }),

        methods: {
            //load all users from DB, we call this often to make sure the data is up to date
            reloadProtofiles() {
                http
                    .get("proto-files")
                    .then(response => {
                        this.protoFiles = response.data.protoFiles;
                        this.populateProtoFilenames();
                    })
                    .catch(e => {
                        this.errors.push(e);
                    });
            },

            changedProtofile(){
                this.selectedServiceName = "";
                this.changedServiceName();
                console.log("populating service names for protofile: " + this.selectedProtoFilename);
                while(this.serviceNames.length){
                    this.serviceNames.pop()
                }
                let selectedProtofile;

                //find the selected protofile
                for (const protoFile of this.protoFiles) {
                    if(protoFile.filename === this.selectedProtoFilename){
                        selectedProtofile = protoFile;
                        //populate with service names
                        for (const service of selectedProtofile.serviceNames) {
                            this.serviceNames.push(service.name);
                        }
                    }
                }
            },

            changedServiceName(){
                this.selectedMethodName = "";
                this.changedMethodName();
                console.log("populating method names for service: " + this.selectedServiceName);
                while(this.methodNames.length){
                    this.methodNames.pop()
                }

                //find the selected protofile
                for (const protoFile of this.protoFiles) {
                    if(protoFile.filename === this.selectedProtoFilename){
                        //find the selected service
                        for (const service of protoFile.serviceNames) {
                            if(service.name === this.selectedServiceName){
                                for(let method of service.methods){
                                    this.methodNames.push(method.name);
                                    //might as well store a cache of this
                                    this.methods.push(method);
                                }
                            }
                        }
                    }
                }
            },

            changedMethodName(){
                this.requestMessageModel = "";
                for(let method of this.methods){
                    if(method.name === this.selectedMethodName){
                        this.requestMessageModel = method.requestName;
                    }
                }
            },

            sendMessage(){
                this.messageSent = false;
                let grpcSendMessageRequest = {
                    filename: this.selectedProtoFilename,
                    serviceName: this.selectedServiceName,
                    methodName: this.selectedMethodName,
                    body: this.messageBody,
                    serverUrl: this.serverUrl
                };

                this.addResponseLog("Sending message...");
                console.log("sending message to grpc");
                http
                    .post("/grpc", grpcSendMessageRequest)
                    .then(response => {
                        console.log("Message sent");
                        this.addResponseLog(response);
                        this.messageSent = true;
                        this.loadRequestHistory();
                    })
                    .catch(e => {
                        console.log("Error sending message");
                        this.addResponseLog("Error: " + e.response.data.message);
                        this.messageSent = true;
                        this.loadRequestHistory();
                    });
            },

            addResponseLog(text){
                this.responseLog.push(text);
            },

            populateProtoFilenames() {
                for (const protoFile of this.protoFiles) {
                    this.protoFilenames.push(protoFile.filename)
                }
            },

            applyHistoryItem(historyItem){
                this.selectedProtoFilename = historyItem.filename;
                this.messageBody = historyItem.body;
                this.serverUrl = historyItem.serverUrl;

                this.changedProtofile();
                this.selectedServiceName = historyItem.serviceName;
                this.changedServiceName();
                this.selectedMethodName = historyItem.methodName;
                this.changedMethodName();
            },

            disableSendMessageButton(){
                return !this.serverUrl ||
                    !this.selectedProtoFilename ||
                    !this.selectedServiceName ||
                    !this.selectedMethodName ||
                    !this.messageBody;
            },

            clearLog(){
                while(this.responseLog.length){
                    this.responseLog.pop()
                }
            },

            clearHistory(){
                http
                    .delete("/grpc/history")
                    .then(response => {
                    })
                    .catch(e => {
                        console.error("Error clearing request history");
                    });
                while(this.requestHistory.length){
                    this.requestHistory.pop()
                }
            },

            loadRequestHistory(){
                http
                    .get("/grpc/history")
                    .then(response => {
                        this.requestHistory = response.data.grpcRequests;
                    })
                    .catch(e => {
                        console.error("Error getting request history");
                    });
            }
        },

        mounted() {
            this.loadRequestHistory();
            this.reloadProtofiles();
        }

    }
</script>

<style>

</style>
