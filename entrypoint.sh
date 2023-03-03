#!/bin/sh

npm i
echo "====== run migrate ======"
npx knex --knexfile ./src/database/knexfile.js migrate:latest

# echo "====== run seeder ======"
# npx knex --knexfile ./src/database/knexfile.js seed:run

node index.js
