#!/usr/bin/env bash
mongod --fork --logpath /var/log/mongodb.log
npm run static > /var/log/app.log 2>&1 &
tail -f /var/log/app.log