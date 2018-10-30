<template>
    <v-container class="pa-0">
        <v-container>
            <template>
                <v-layout row>
                    <v-flex>
                        <v-card>
                            <!-- Begin Toolbar -->
                            <v-toolbar class="primary primaryText--text">
                                <v-toolbar-title> Proto Files </v-toolbar-title>
                                <v-spacer></v-spacer>

                                <!-- Add Dialog Button -->
                                <v-dialog v-model="addDialog" lazy absolute max-width="50%">
                                    <v-btn class="primaryText--text" icon slot="activator">
                                        <v-icon> control_point </v-icon>
                                    </v-btn>

                                    <!-- Add Dialog -->
                                    <protoAddDialog @closeAdd="addDialog = false; reloadProtofiles()" @alert="alert">
                                    </protoAddDialog>
                                </v-dialog>
                            </v-toolbar>
                            <!-- List of Proto files -->
                            <span  v-if="protoFiles.length">
                                <protoFileItem v-for="protoFile in protoFiles" :key="protoFile._id"
                                          :protoFile="protoFile" @reloadProtofiles="reloadProtofiles"
                                          >
                                </protoFileItem>
                            </span>
                            <div v-else>
                                <br/>
                                <v-card flat class="subheading text-xs-center">No proto files to show, upload some.</v-card>
                                <br/>
                            </div>
                        </v-card>
                    </v-flex>
                </v-layout>
            </template>
        </v-container>
    </v-container>
</template>

<script>
    import { http } from "../config/http.js"
    import protoFileItem from "../components/protoFile.vue"
    import protoAddDialog from "../components/protoAddDialog.vue"

    export default {
        //Variables
        data: () => ({
            errors: [],
            protoFiles: [],
            protoFileToDelete: {},
            deleteDialog: false,
            addDialog: false,
            editName: "",
        }),

        //Components this page will need
        components: {
            protoFileItem: protoFileItem,
            protoAddDialog: protoAddDialog
        },

        //The methods we will need
        methods: {
            //load all users from DB, we call this often to make sure the data is up to date
            reloadProtofiles() {
                http
                    .get("proto-files")
                    .then(response => {
                        this.protoFiles = response.data.protoFiles;
                    })
                    .catch(e => {
                        this.errors.push(e);
                    });
            },

            //build the alert info for us
            //Will emit an alert, followed by a boolean for success, the type of call made, and the name of the
            //resource we are working on
            alert(success, callName, resource) {
                console.log('Page Alerting');
                this.$emit('alert', success, callName, resource);
                this.reloadProtofiles();
            }
        },

        //get those users
        mounted() {
            this.reloadProtofiles();
        }
    };
</script>