#!/bin/bash

sleep 20

npm i
npx knex --knexfile ./src/database/knexfile.js migrate:latest
npx knex --knexfile ./src/database/knexfile.js seed:run
node index.js
