/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("treatmentedMenus", function (table) {
    table
      .integer("menuId")
      .references("id")
      .inTable("menus")
      .onDelete("CASCADE");
    table
      .integer("carteId")
      .references("id")
      .inTable("cartes")
      .onDelete("CASCADE");
    // 複合主キーを設定する
    table.primary(["menuId", "carteId"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("treatmentedMenus");
};
