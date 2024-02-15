/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("treatmentedMenus").del();
  await knex("treatmentedMenus").insert([{ menuId: 1, karteId: 1 }]);
};
