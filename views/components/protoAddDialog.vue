<template>
    <v-card>
        <v-toolbar class="primary primaryText--text">
            <v-toolbar-title > Add a Proto file </v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
            <v-card-text>
                <file-upload
                        post-action="http://localhost:5052/api/proto-files/upload"
                        extensions="proto"
                        :multiple="true"
                        :size="1024 * 1024 * 10"
                        v-model="files"
                        ref="upload"
                >
                    <v-btn>Select Proto Files</v-btn>
                </file-upload>

                <v-spacer></v-spacer>

                <v-container fluid>
                    <span  v-if="files.length">
                        <v-label v-for="(file) in files">
                            <span>{{file.name}}</span> -
                            <span v-if="file.error">{{file.error}}</span>
                            <span v-else-if="file.success">success</span>
                            <span v-else-if="file.active">active</span>
                            <br />
                        </v-label>
                    </span>
                </v-container>

                <v-spacer></v-spacer>
                <v-btn type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    Start Upload
                </v-btn>
                <v-btn type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
                    <i class="fa fa-stop" aria-hidden="true"></i>
                    Stop Upload
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="close()" class="red white--text">Close</v-btn>
            </v-card-text>
        </v-container>
    </v-card>

</template>

<script>
    import FileUpload from 'vue-upload-component';

    export default {
        components: {
            FileUpload,
        },

        data() {
            return {
                files: [],
            }
        },

        methods: {
            close() {
                this.files = [];
                this.$emit('closeAdd')
            },

            alert(success, callName, resource) {
                console.log('Add Alerting');
                this.$emit('alert', success, callName, resource)
            }
        }
    }
</script>