<template>

    <v-container class="pa-0">
        <v-container grid-list-md>
            <template>
                <v-layout>
                    <v-flex xs8>
                        <v-card>
                            <v-toolbar class="primary primaryText--text">
                                <v-toolbar-title> Kafka</v-toolbar-title>
                            </v-toolbar>
                            <v-container fluid>
                                <v-card-text>
                                    <v-form ref="form">
                                        <v-text-field label="Server URL" v-model="serverUrl"> </v-text-field>
                                        <v-text-field label="Topic" v-model="topic"> </v-text-field>
                                        <v-select v-model="selectedProtoFilename" :items="protoFilenames" :hint="`Proto file`" persistent-hint @change="populateMessageModels"></v-select>
                                        <v-select v-model="selectedMessageName" :items="messageModels" :hint="`Message model`" persistent-hint></v-select>
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
                                <span  v-if="kafkaResponseLog.length">
                                    <v-label v-for="logItem in kafkaResponseLog">
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
                                                <div slot="header">{{historyItem.messageName}}</div>
                                                <v-container grid-list-md text-xs-center>
                                                    <v-layout row>
                                                            <v-flex xs-6 class="text-xs-left">
                                                                <v-btn block @click="applyHistoryItem(historyItem)">Apply</v-btn>
                                                                <v-spacer></v-spacer>
                                                                <v-label>
                                                                    Server URL: {{historyItem.kafkaServerUrl}}
                                                                    <br />
                                                                    Topic: {{historyItem.topic}}
                                                                    <br />
                                                                    Proto file: {{historyItem.filename}}
                                                                    <br />
                                                                    Message Name: {{historyItem.messageName}}
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
            protoFilename: "",
            topic: "",
            messageBody: "",
            protoFiles: [],
            protoFilenames: [],
            selectedProtoFilename: "",
            selectedMessageName: "",
            messageModels: [],
            isLoadingMessageNames: false,
            kafkaResponseLog:[],
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

            sendMessage(){
                this.messageSent = false;
                let kafkaSendMessageRequest = {
                    filename: this.selectedProtoFilename,
                    messageName: this.selectedMessageName,
                    body: this.messageBody,
                    kafkaServerUrl: this.serverUrl,
                    topic: this.topic
                };

                this.setKafkaResponseText("Sending message...");
                console.log("sending message to kafka");
                http
                    .post("/kafka", kafkaSendMessageRequest)
                    .then(response => {
                        console.log("Message sent");
                        this.setKafkaResponseText(response);
                        this.messageSent = true;
                        this.loadRequestHistory();
                    })
                    .catch(e => {
                        console.log("Error sending message");
                        this.setKafkaResponseText("Error: " + e.response.data.message);
                        this.messageSent = true;
                        this.loadRequestHistory();
                    });
            },

            setKafkaResponseText(text){
                this.kafkaResponseLog.push(text);
            },

            populateProtoFilenames() {
                for (const protoFile of this.protoFiles) {
                    this.protoFilenames.push(protoFile.filename)
                }
            },

            populateMessageModels(input){
                this.selectedProtoFilename = input;
                this.selectedMessageName = "";
                console.log("populating message models for protofile: " + this.selectedProtoFilename);
                this.isLoadingMessageNames = true;
                while(this.messageModels.length){
                    this.messageModels.pop()
                }
                let selectedProtofile;

                //find the selected protofile
                for (const protoFile of this.protoFiles) {
                    if(protoFile.filename === this.selectedProtoFilename){
                        selectedProtofile = protoFile;
                        //populate with message models
                        for (const message of selectedProtofile.messageNames) {
                            this.messageModels.push(message.name);
                        }
                    }
                }

                this.isLoadingMessageNames = false;
            },

            applyHistoryItem(historyItem){
                this.selectedProtoFilename = historyItem.filename;
                this.messageBody = historyItem.body;
                this.serverUrl = historyItem.kafkaServerUrl;
                this.topic = historyItem.topic;

                this.populateMessageModels(historyItem.filename);
                this.selectedMessageName = historyItem.messageName;
            },

            disableSendMessageButton(){
                if (!this.serverUrl ||
                    !this.topic ||
                    !this.messageBody ||
                    !this.selectedProtoFilename ||
                    !this.selectedMessageName) {
                    return true
                } else {
                    return false
                }
                return false;
            },

            clearLog(){
                while(this.kafkaResponseLog.length){
                    this.kafkaResponseLog.pop()
                }
            },

            clearHistory(){
                http
                    .delete("/kafka/history")
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
                    .get("/kafka/history")
                    .then(response => {
                        this.requestHistory = response.data.kafkaRequests;
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
