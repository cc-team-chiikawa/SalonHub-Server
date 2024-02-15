/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("menus").del();
  await knex("menus").insert([
    {
      menuName: "カット",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金有り。",
    },
    {
      menuName: "カラー＋カット",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金有り。",
    },
    {
      menuName: "カット+インナーカラー",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金有り。※ブリーチ1回",
    },
    {
      menuName: "カット+ハイトーンカラー",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金有り。※ケアブリーチ1回",
    },
    {
      menuName: "パーマ＋カット",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金はなし。",
    },
    {
      menuName: "パーマ＋カット＋トリートメント",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金はなし。",
    },
    {
      menuName: "縮毛矯正(ハイストレート)＋カット",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金有り。",
    },
    {
      menuName: "ヘッドスパ(30分)＋カット",
      menuOverview:
        "シャンプー・ブロー込みの価格となっております。ロング料金有り。",
    },
    {
      menuName: "眉カット",
      menuOverview:
        "眉でイメージ変わります。形や細さ、なりたいイメージなどなんでもご相談ください。ほかのメニューとセットも可能。",
    },
    {
      menuName: "小さなお子様カット（0～3歳のお子様）",
      menuOverview:
        "髪の量などによって料金が変わります。施術時間は約30分です。",
    },
  ]);
};
