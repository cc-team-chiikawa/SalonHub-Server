/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("customersGenres", function (table) {
    table
      .integer("customerId")
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table
      .integer("genreId")
      .references("id")
      .inTable("genres")
      .onDelete("CASCADE");
    // 複合主キーを設定する
    table.primary(["customerId", "genreId"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("customersGenres");
};
