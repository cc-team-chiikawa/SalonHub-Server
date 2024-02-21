const OpenAI = require("openai");
require("dotenv").config();

class OpenAIWrapper {
  async generateImage(tags) {
    const openai = new OpenAI({
      // APIキーを環境変数から取得、取り扱いに注意。
      // もしAPIキーの値をGitHub上にアップしてしまったら連絡。
      apiKey: process.env.OPENAI_API_KEY,
    });

    const tagsText = tags.reduce((acc, tag) => acc + `「${tag}」`, "");

    const promptText = `以下のキーワードから画像を作成してください。
    ${tagsText}
    
    作成の際、以下のルールを必ず守ってください。
    ・日本人
    ・写真のような画像
    ・細部まで精細に描かれている
    ・首から頭までの画像
    ・背景は白
    `;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: promptText,
      n: 1, // 数
      // response_format: "url",
      response_format: "b64_json", // base64エンコードで返す
      size: "1024x1024",
      // size: "1728x1024", // dall-e-3だと横向きが指定できる
      style: "natural", // vividとnaturalが選べる
    });

    const data = response.data[0];
    return data.b64_json;
  }
}

module.exports = { OpenAIWrapper };
