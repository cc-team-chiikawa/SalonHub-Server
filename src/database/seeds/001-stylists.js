/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("stylists").del();
  await knex("stylists").insert([
    {
      stylistType: 1,
      loginId: "中村裕介",
      name: "中村裕介",
      kana: "なかむらゆうすけ",
      post: "スタイリスト",
      joinedDate: "2020-02-15",
      photo: null,
    },
    {
      stylistType: 0,
      loginId: "田中陽平",
      name: "田中陽平",
      kana: "たなかようへい",
      post: "店長",
      joinedDate: "2015-01-01",
      photo: null,
    },
  ]);
};
