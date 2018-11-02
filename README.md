# Super Probugr

## Goals of Super Probugr
Create a simple UI for interfacing with Kafka and gRPC using protobufs. This is a tool, not an example of a perfect js app. 

## Workflow
A user should be able to...
1. Upload their proto files.
2. From a JSON body, send messages to Kafka or call gRPC service methods.
3. Be cool.

## Usage
To run with host networking `docker run -d --network host mickoallen/super-probugr:latest`. This is recommended since it makes calling back to your local gRPC services and Kafka broker simpler, but only works in environments where host networking is supported, such as linux.

To run without host networking `docker run -d -p 5052:5052 mickoallen/super-probugr:latest`.


## Installation

Requires Node >=8.0, NPM >=5

`npm install`

## Setup/Development 

1. Start mongodb `cd mongodb` + `docker-compose up`
2. `npm run dev:serve` or debug `super-probugr/bin/www` with env var PORT=5052 in Intellij to start the server.
3. `npm run dev:client`to start the UI with hot reload

## Technologies
- NodeJS
- Express
- VueJS
- Vuetify Material Design Framework
- MongoDB

Code was based on this template - https://github.com/aturingmachine/mevn-stack

Lot's of cleanup needs to happen, naming, organization etc.

## Todo list
|Feature|Status|
|---|---|
|Change json input and display boxes to a json formatted component|todo|
|Remember user preferences for theme select|todo|

## Known Issues
- Hover and click states doesn't work with the 'Select Proto Files' button in the upload dialogue.
- Occasional race conditions trying to start the container.
- Enum values in the JSON must be represented by their index as defined in the proto, no the associating value.



