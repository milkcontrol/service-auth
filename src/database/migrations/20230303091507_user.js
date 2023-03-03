/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable("users", (table) => {
        table.uuid("uid").primary();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.tinyint("role").notNullable();
        table.timestamp("createdAt").notNullable();
        table.timestamp("updatedAt").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable("users");

};
