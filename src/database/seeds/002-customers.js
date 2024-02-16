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
    {
      cardNumber: "0000000000000002",
      birthday: "1994-08-15",
      name: "田中一郎",
      kana: "たなかいちろう",
      gender: 0,
      phoneNumber: 9567567890,
      adress: "defghijk@gmail.com",
      hairThickness: 1,
      hairHardness: 1,
      hairAmount: 1,
      allergy: "花粉症",
      memo1: "寡黙",
      memo2: null,
      memo3: null,
      memo4: null,
      memo5: null,
    },
    {
      cardNumber: "0000000000000003",
      birthday: "1990-06-20",
      name: "木谷みゆ",
      kana: "きたにみゆ",
      gender: 1,
      phoneNumber: 11117567890,
      adress: "lmn@gmail.com",
      hairThickness: 2,
      hairHardness: 4,
      hairAmount: 5,
      allergy: "ほこり",
      memo1: "自然なスタイルが好き",
      memo2: "前髪は短めを好んでいる",
      memo3: "バイトで忙しい",
      memo4: null,
      memo5: null,
    },
  ]);
};
