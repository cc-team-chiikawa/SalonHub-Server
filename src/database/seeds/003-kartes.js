/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("kartes").del();
  await knex("kartes").insert([
    {
      customerId: 1,
      stylistId: 1,
      treatmentDay: "2024-02-15",
      order: "丸みを残したショートボブ",
      memo1: "前髪にこだわりがあるようだ",
      memo2: null,
      memo3: null,
      memo4: null,
      memo5: null,
      photo: null,
    },
  ]);
};
