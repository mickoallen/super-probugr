#!/usr/bin/env bash
mongod --port 57017 --fork --logpath /var/log/mongodb.log
npm run static > /var/log/app.log 2>&1 &
echo "How to fix a race condition? sleep(x)"
sleep 4
tail -f /var/log/app.log