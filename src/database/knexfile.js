require('dotenv').config({ path: __dirname + "/../../.env" });

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            // password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            user: "root",
            password: process.env.DB_PASSWORD_ROOT,
        },
        pool: {
            min: 0,
            max: 7
        },
        migrations: {
            directory: "./migrations",
        },
        seeds: {
            directory: './seeds'
        },
        debug: true
    },
};
