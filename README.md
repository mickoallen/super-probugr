# Super Probugr

### Goals of Super Probugr
Create a simple UI for interfacing with Kafka and gRPC using protobufs.

### Workflow
A user should be able to...
1. Upload their proto files.
2. From a JSON body, send messages to Kafka or call gRPC service methods.

Code was based on this template - https://github.com/aturingmachine/mevn-stack (Still some of the user files left for when i need to look up shit)

Lot's of cleanup needs to happen, naming, organization etc.

## Installation

Requires Node >=7.0

`npm install`

## Setup/Development 

1. Start mongodb `cd mongodb` + `docker-compose up`
2. `npm run dev:serve` or debug `super-probugr/bin/www` with env var PORT=8080 in Intellij to start the server.
3. `npm run dev:client`to start the UI with hot reload

## Technologies
- NodeJS
- Express
- VueJS
- Vuetify Material Design Framework
- MongoDB

## Todo list
|Feature|Status|
|---|---|
|Upload/Delete proto files|done (needs improving)|
|Interface with Kafka|done|
|Interface with gRPC|todo|
|Keep history of previous request, and be able to load them back into the UI|todo|
|Package into Dockerfile for easy use|todo| 

## Known Issues
- Protofiles are saved to /tmp/protos, if the OS decides to clear this they will be lost.
- The protofiles are inspected during upload, extracting the method and service names. This needs to be moved out and not saved in the db. The message names should be read at runtime and returned to the UI immediately. The issue with reading them during the upload is if the user is uploading multiple files with dependencies between them they would need to upload them in a specific order.
- Hover and click states doesn't work with the 'Select Proto Files' button in the upload dialogue.


