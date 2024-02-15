/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("interestingMenus", function (table) {
    table
      .integer("menuId")
      .references("id")
      .inTable("menus")
      .onDelete("CASCADE");
    table
      .integer("karteId")
      .references("id")
      .inTable("kartes")
      .onDelete("CASCADE");
    // 複合主キーを設定する
    table.primary(["menuId", "karteId"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("interestingMenus");
};
