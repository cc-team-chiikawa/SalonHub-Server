/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("genres").del();
  await knex("genres").insert([
    { name: "グルメ" },
    { name: "ゲーム" },
    { name: "ドラマ" },
    { name: "スポーツ" },
    { name: "政治・経済" },
    { name: "家族" },
    { name: "ファッション" },
    { name: "アニメ" },
  ]);
};
