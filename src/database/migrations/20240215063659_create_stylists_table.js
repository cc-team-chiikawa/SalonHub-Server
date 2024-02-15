/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("stylists", function (table) {
    table.increments("id").primary();
    table.smallint("stylistType").notNullable();
    table.string("loginId", 256).unique().notNullable();
    table.string("name", 256).notNullable();
    table.string("kana", 256).notNullable();
    table.string("post", 256).nullable();
    table.date("joinedDate").notNullable();
    table.string("photo", 256).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("stylists");
};
