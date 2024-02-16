/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("customersGenres").del();
  await knex("customersGenres").insert([
    { customerId: 1, genreId: 1 },
    { customerId: 1, genreId: 6 },
    { customerId: 1, genreId: 8 },
    { customerId: 2, genreId: 2 },
    { customerId: 2, genreId: 4 },
    { customerId: 3, genreId: 5 },
  ]);
};
