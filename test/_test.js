const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const createserver = require("../src/server/server");
chai.should();
const path = require("path");
const config = require(path.join(__dirname, "../knexfile"));
const knex = require("knex")(config.test);

const server = createserver();

before(async () => {
  // マイグレーション実行
  await knex.migrate.latest();
  // シード実行
  await knex.seed.run();
});

after(async () => {
  // テスト後にロールバック
  await knex.migrate.rollback();
});

// TODO: 時間があれば

describe("serverのテスト", () => {
  beforeEach(() => {
    request = chai.request(server);
  });

  it("GET /api/customers", async () => {
    const res = await request.get("/api/customers");
    res.should.be.json;
    console.log(JSON.parse(res.text));
  });

  describe("POST /api/customers", () => {
    it("should add customer", async () => {
      const newItem = {
        cardNumber: "56899FGHI8KLMNOP",
        birthday: "19941002",
        name: "田中太郎",
        kana: "たなかたろう",
        gender: 0,
        phoneNumber: "00000000000",
        adress: "bbb@gmail.com",
        hairThickness: 4,
        hairHardness: 5,
        hairAmount: 1,
        allergy: "花粉症（重症）",
        memo1: "明るい",
        memo2: "においに敏感",
        memo3: null,
        memo4: null,
        memo5: null,
      };

      const res = await request.post("/api/customers").send(newItem);
      res.should.be.json;

      console.log(res.text);
      // レスポンスから取得した新しい顧客データ
      const newCustomer = JSON.parse(res.text);

      // 期待するデータと実際のデータが一致するか確認
      newCustomer.should.deep.equal(newItem);
    });
  });
});
