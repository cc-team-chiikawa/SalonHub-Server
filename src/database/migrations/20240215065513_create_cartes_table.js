/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("cartes", function (table) {
    table.increments("id").primary();
    table
      .integer("customerId")
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table
      .integer("stylistId")
      .references("id")
      .inTable("stylists")
      .onDelete("CASCADE");
    table.date("treatmentDay").notNullable();
    table.string("order", 1000).nullable();
    table.string("memo1", 1000).nullable();
    table.string("memo2", 1000).nullable();
    table.string("memo3", 1000).nullable();
    table.string("memo4", 1000).nullable();
    table.string("memo5", 1000).nullable();
    table.string("photo", 1000).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("cartes");
};
