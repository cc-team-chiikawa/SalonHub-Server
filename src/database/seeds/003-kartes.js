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
    {
      customerId: 2,
      stylistId: 2,
      treatmentDay: "2024-01-10",
      order: "伸びた分だけカット",
      memo1: "伸びた分より少し多めにカットした",
      memo2: null,
      memo3: null,
      memo4: null,
      memo5: null,
      photo: null,
    },
    {
      customerId: 3,
      stylistId: 1,
      treatmentDay: "2023-12-05",
      order: "カットと明るめのカラー",
      memo1: "ミルクティーベージュにした",
      memo2: "次回は暗めの色を希望",
      memo3: null,
      memo4: null,
      memo5: null,
      photo: null,
    },
  ]);
};
