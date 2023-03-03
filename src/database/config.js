// Update with your config settings.

/**
 * @type {knex | (<TRecord=any extends {}, TResult=unknown[]>(config: (Knex.Config | string)) => Knex<TRecord, TResult>) | {Knex: Knex; knex: {<TRecord=any extends {}, TResult=unknown[]>(config: (Knex.Config | string)): Knex<TRecord, TResult>}; readonly default: knex | (<TRecord=any extends {}, TResult=unknown[]>(config: (Knex.Config | string)) => Knex<TRecord, TResult>)}}
 */

const knex = require("knex");
const config = require("./knexfile");
require('dotenv').config({ path: __dirname + "/../../.env" });

const knexConfig = knex({
    client: 'mysql2',
    connection: config[process.env.NODE_ENV].connection,
    pool: config[process.env.NODE_ENV].pool,
    debug: true
});

knexConfig.raw("SELECT 1").then(() => {
    console.log("MySQL connected");
})
    .catch((e) => {
        console.log('test env variable: ', process.env.DB_PORT)
        console.log("MySQL not connected");
        console.error(e);
    });

module.exports = knexConfig;