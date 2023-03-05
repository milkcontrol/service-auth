/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.table('users', table => {
        table.tinyint("type").notNullable();
        table.tinyint("subType").nullable();
    })
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.table('users', table => {
        //type include: 0-Device, 1-App
        table.dropColumn("type").notNullable();
        //subType include: 0-Mobile, 1-Web
        table.dropColumn("subType").nullable();
    })
  };
