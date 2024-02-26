const OpenAI = require("openai");
require("dotenv").config();
const basePrompt = `
似合う髪型を考えています。正面を向いたバストショットで写実的な画像を作ってください。
以下の要件に従って提案してください。
・日本人
・服装は白のTシャツ
・25歳
・女性
・丸顔（輪郭が丸い）
・暗めの茶髪
・ショートカット（首周りで切りそろえられた長さ）

`;
// 追加の指定は以下の通りです。
// ・ロング（肩よりも長い）の髪
// ・髪の色はオレンジブラウン
// ・顔の輪郭は丸型`;

// 左分け、右分け、センター分け、分け目なし
class OpenAIWrapper {
  async generateImage(tags) {
    const openai = new OpenAI({
      // APIキーを環境変数から取得、取り扱いに注意。
      // もしAPIキーの値をGitHub上にアップしてしまったら連絡。
      apiKey: process.env.OPENAI_API_KEY,
    });

    const tagsText = tags.reduce((acc, tag) => acc + `「${tag}」`, "");
    const promptText = basePrompt + tagsText;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: promptText,
      n: 1, // 数
      // response_format: "url",
      response_format: "b64_json", // base64エンコードで返す
      size: "1024x1024",
      // size: "1728x1024", // dall-e-3だと横向きが指定できる
      style: "vivid", // vividとnaturalが選べる
    });

    const data = response.data[0];
    return data.b64_json;
  }
}

class OpenAIWrapperURL {
  async generateImage(tags) {
    const openai = new OpenAI({
      // APIキーを環境変数から取得、取り扱いに注意。
      // もしAPIキーの値をGitHub上にアップしてしまったら連絡。
      apiKey: process.env.OPENAI_API_KEY,
    });

    const tagsText = tags.reduce((acc, tag) => acc + `「${tag}」`, "");
    const promptText = basePrompt + tagsText;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: promptText,
      n: 1, // 数
      response_format: "url",
      // response_format: "b64_json", // base64エンコードで返す
      size: "1024x1024",
      // size: "1728x1024", // dall-e-3だと横向きが指定できる
      style: "natural", // vividとnaturalが選べる
    });

    console.log("response.data[0] = ", response.data[0]);

    const data = response.data[0];
    return data.b64_json;
  }
}

module.exports = { OpenAIWrapper, OpenAIWrapperURL };
