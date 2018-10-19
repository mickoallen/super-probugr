FROM node:10.6

RUN apt-get update
RUN apt-get -y install mongodb

RUN mkdir -p /data/db

COPY . /home/node/app/

CMD [ "mongod", "--bind_ip", "0.0.0.0" ]
