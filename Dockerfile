FROM node:8-alpine

RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python \
      mongodb

RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash

RUN mkdir -p /data/db

# Create app directory
RUN mkdir -p /usr/local/app
RUN mkdir -p /usr/local/protos
RUN mkdir -p /usr/local/uploads

COPY . /usr/local/app/

# Move to the app directory
WORKDIR /usr/local/app
RUN npm install

#RUN npm install
EXPOSE 8080 8080

RUN chmod +x run.sh
CMD [ "/usr/local/app/run.sh" ]
