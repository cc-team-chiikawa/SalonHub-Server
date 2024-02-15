/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("interestingMenus").del();
  await knex("interestingMenus").insert([
    { menuId: 8, karteId: 1 },
    { menuId: 9, karteId: 1 },
  ]);
};
