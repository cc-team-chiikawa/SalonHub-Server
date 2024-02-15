/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("interestingMenus").del();
  await knex("interestingMenus").insert([
    { menuId: 8, carteId: 1 },
    { menuId: 9, carteId: 1 },
  ]);
};
