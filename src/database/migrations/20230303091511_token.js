/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable("tokens", (table) => {
        table.uuid("uid").primary();
        table.uuid("userId").notNullable();
        table.boolean("isRevoked");
        table.timestamp("createdAt").notNullable();
        table.timestamp("updatedAt").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable("tokens");
};
