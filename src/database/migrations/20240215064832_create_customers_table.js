/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("customers", function (table) {
    table.increments("id").primary();
    table.string("cardNumber", 16).unique().notNullable();
    table.date("birthday").notNullable();
    table.string("name", 256).notNullable();
    table.string("kana", 256).notNullable();
    table.smallint("gender").notNullable();
    table.bigInteger("phoneNumber").nullable();
    table.string("adress", 256).nullable();
    table.smallint("hairThickness").notNullable();
    table.smallint("hairHardness").notNullable();
    table.smallint("hairAmount").notNullable();
    table.string("allergy", 1000).nullable();
    table.string("memo1", 1000).nullable();
    table.string("memo2", 1000).nullable();
    table.string("memo3", 1000).nullable();
    table.string("memo4", 1000).nullable();
    table.string("memo5", 1000).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("customers");
};
