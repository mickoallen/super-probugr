<template>
    <v-expansion-panel>
        <v-expansion-panel-content class="elevation-24">
            <div v-if="protoFile.errorMessage" slot="header" class="error--text">{{ protoFile.filename }} - Proto contains errors</div>
            <div v-else slot="header">
                {{ protoFile.filename }}
            </div>
            <hr>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs-6 class="text-xs-left">
                        <v-card v-if="protoFile.errorMessage">
                            Error Message: {{protoFile.errorMessage}}
                        </v-card>
                        <v-card>
                            Messages: {{ protoFile.messageNames }}
                        </v-card>
                        <v-card>
                            Services: {{ protoFile.serviceNames }}
                        </v-card>
                    </v-flex>
                    <v-flex xs-4 class="text-xs-right">
                        <v-card>
                            <v-btn class="red darken-2" @click="deleteProto(protoFile)">
                                <v-icon dark>remove_circle_outline</v-icon>
                            </v-btn>
                        </v-card>

                    </v-flex>
                </v-layout>
            </v-container>
            <hr>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import { http } from "../config/http.js"
    import VLabel from "vuetify/lib/components/VLabel/VLabel";

    export default {
        components: {VLabel},
        props: {
            protoFile: {
                type: Object
            }
        },
        methods: {
            deleteProto(protoFileToDelete){
                const deleteRequest = {
                    protofileName: protoFileToDelete.filename
                };

                http
                    .post("proto-files/delete", deleteRequest)
                    .then(response => {
                        this.$emit('reloadProtofiles');
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }
        }
    }
</script>