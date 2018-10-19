<template>
    <v-container class="pa-0">
        <v-container>
            <template>
                <v-layout row>
                    <v-flex>
                        <v-card>
                            <v-toolbar class="primary primaryText--text">
                                <v-toolbar-title> Welcome to the gRPC Page</v-toolbar-title>
                            </v-toolbar>
                            <v-container fluid>
                                <v-card-text>
                                    <v-form ref="form">
                                        <v-text-field label="Server URL" v-model="serverUrl"> </v-text-field>
                                        <v-text-field label="Topic" v-model="topic"> </v-text-field>
                                        <v-textarea label="Message Body" v-model="messageBody" autoGrow="true"  ></v-textarea>
                                        <v-select v-model="selectedProtoFilename" :items="protoFilenames" :hint="`Proto file`" persistent-hint @change="populateMessageModels"></v-select>
                                        <v-select v-model="selectedMessageName" :items="messageModels" :hint="`Message model`" persistent-hint></v-select>
                                    </v-form>
                                    <br />
                                    <v-btn @click="sendMessage()" block :disabled="disableSendMessageButton()" :loading="!messageSent">Send message</v-btn>
                                </v-card-text>
                            </v-container>
                        </v-card>

                        <v-card>
                            <v-btn @click="clearLog()">Clear log</v-btn>
                            <v-container fluid>
                                <span  v-if="kafkaResponseLog.length">
                                    <v-label v-for="logItem in kafkaResponseLog">
                                        {{logItem}}
                                        <br />
                                    </v-label>
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
            messageSent: true
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
                    })
                    .catch(e => {
                        console.log("Error sending message");
                        this.setKafkaResponseText("Error: " + e.response.data.message);
                        this.messageSent = true;
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
                this.kafkaResponseText = "";
            }
        },

        mounted() {
            this.reloadProtofiles();
        }

    }
</script>

<style>

</style>
