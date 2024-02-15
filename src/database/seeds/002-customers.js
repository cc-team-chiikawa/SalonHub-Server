/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("customers").del();
  await knex("customers").insert([
    {
      cardNumber: "0000000000000001",
      birthday: "2001-10-15",
      name: "高橋朱美",
      kana: "たかはしあけみ",
      gender: 1,
      phoneNumber: 1234567890,
      adress: "abc@gmail.com",
      hairThickness: 3,
      hairHardness: 3,
      hairAmount: 3,
      allergy: null,
      memo1: "話すのが好きなイメージ",
      memo2: null,
      memo3: null,
      memo4: null,
      memo5: null,
    },
  ]);
};
