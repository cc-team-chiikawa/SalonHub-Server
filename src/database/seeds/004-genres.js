/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("genres").del();
  await knex("genres").insert([
    { genreName: "グルメ" },
    { genreName: "ゲーム" },
    { genreName: "ドラマ" },
    { genreName: "スポーツ" },
    { genreName: "政治・経済" },
    { genreName: "家族" },
    { genreName: "ファッション" },
    { genreName: "アニメ" },
  ]);
};
