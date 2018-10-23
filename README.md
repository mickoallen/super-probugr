# Super Probugr

### Goals of Super Probugr
Create a simple UI for interfacing with Kafka and gRPC using protobufs.

### Workflow
A user should be able to...
1. Upload their proto files.
2. From a JSON body, send messages to Kafka or call gRPC service methods.

Code was based on this template - https://github.com/aturingmachine/mevn-stack (Still some of the user files left for when i need to look up shit)

Lot's of cleanup needs to happen, naming, organization etc.

## Docker
To build `docker build -t superprobugr .`.
To run `docker run -p 8080:8080 superprobugr`.

## Installation

Requires Node >=8.0, NPM >=5git

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
|Upload/Delete proto files|done|
|Interface with Kafka|done|
|Interface with gRPC|todo|
|Change json input and display boxes to a json formatted component|todo|
|Remember user preferences for theme select|todo|
|Keep history of previous request, and be able to load them back into the UI|done (for kafka)|
|Package into Dockerfile for easy use|done| 

## Known Issues
- Hover and click states doesn't work with the 'Select Proto Files' button in the upload dialogue.


