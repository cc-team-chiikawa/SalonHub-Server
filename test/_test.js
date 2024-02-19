const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const createserver = require("../src/server/server");
chai.should();
const path = require("path");
const config = require(path.join(__dirname, "../knexfile"));
const knex = require("knex")(config.test);

const server = createserver();

// 16桁のランダムな数字を生成
function generateRandomCardNumber() {
  const randomNumber = Math.floor(Math.random() * 10000000000000000);
  return randomNumber.toString().padStart(16, "0");
}

before(async () => {
  // マイグレーション実行
  await knex.migrate.latest();
  // シード実行
  await knex.seed.run();
  console.log("Before pass");
});

after(async () => {
  // テスト後にロールバック
  await knex.migrate.rollback();
  console.log("After pass");
});

// TODO: 時間があれば

describe("serverのテスト", () => {
  beforeEach(async () => {
    const randomCardNumber = generateRandomCardNumber();
    await knex("customers").where({ cardNumber: randomCardNumber }).del();
    // console.log("Database cleaned up");
    request = chai.request(server);
  });

  describe("POST /api/customers", () => {
    it("should add customer", async () => {
      const randomCardNumber = generateRandomCardNumber();
      const newItem = {
        cardNumber: randomCardNumber,
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

      res.should.have.status(201);
      res.should.be.json;
      const newCustomer = res.body;

      newCustomer.should.deep.equal({
        id: newCustomer.id,
        cardNumber: randomCardNumber,
        birthday: "1994-10-01T15:00:00.000Z",
        name: "田中太郎",
        kana: "たなかたろう",
        gender: 0,
        phoneNumber: "0",
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
      });
    });
  });

  describe("GET /api/customers/:id", () => {
    it("should return customerinfo by id", async () => {
      const res = await request.get("/api/customers/1");
      const expected = {
        id: 1,
        card_number: "0000000000000001",
        birthday: "2001-10-14T15:00:00.000Z",
        name: "高橋朱美",
        kana: "たかはしあけみ",
        gender: 1,
        phone_number: "1234567890",
        adress: "abc@gmail.com",
        hair_thickness: 3,
        hair_hardness: 3,
        hair_amount: 3,
        allergy: null,
        memo1: "話すのが好きなイメージ",
        memo2: null,
        memo3: null,
        memo4: null,
        memo5: null,
        kartes: [{ id: 1, treatment_day: "2024-02-14T15:00:00.000Z" }],
        genres: [
          { id: 1, name: "グルメ" },
          { id: 6, name: "家族" },
          { id: 8, name: "アニメ" },
        ],
      };
      res.should.have.status(200);
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(expected);
    });
  });

  describe("POST /api/customers/login", () => {
    it("should return cardNumber and birthday by id", async () => {
      const customerData = {
        cardNumber: "0000000000000001",
        birthday: "20011015",
      };
      const res = await request.post("/api/customers/login").send(customerData);
      const expected = { id: 1 };
      res.should.have.status(200);
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(expected);
    });
  });

  describe("POST /api/kartes", () => {
    it("should add kartes", async () => {
      const newItem = {
        customerId: 3,
        stylistId: 1,
        treatmentDay: "20240216",
        order: "5cmだけ切りたい",
        memo1: "施術中にもう少し切ることになった",
        memo2: "セットがしやすいよう束感が出るようにカット",
        memo3: null,
        memo4: null,
        memo5: null,
        photo: null,
      };

      const res = await request.post("/api/kartes").send(newItem);
      res.should.have.status(201);
      res.should.be.json;
      const newKartes = res.body;

      newKartes.should.deep.equal({
        id: newKartes.id,
        customerId: 3,
        stylistId: 1,
        treatmentDay: "2024-02-15T15:00:00.000Z",
        order: "5cmだけ切りたい",
        memo1: "施術中にもう少し切ることになった",
        memo2: "セットがしやすいよう束感が出るようにカット",
        memo3: null,
        memo4: null,
        memo5: null,
        photo: null,
      });
    });
  });

  describe("GET /api/kartes/id", () => {
    it("should return karte by id", async () => {
      const res = await request.get("/api/kartes/1");
      const expected = {
        id: 1,
        customer_id: 1,
        stylist_id: 1,
        treatment_day: "2024-02-14T15:00:00.000Z",
        order: "丸みを残したショートボブ",
        memo1: "前髪にこだわりがあるようだ",
        memo2: null,
        memo3: null,
        memo4: null,
        memo5: null,
        photo: null,
        treatmented: [
          {
            id: 1,
            name: "カット",
          },
        ],
        interesting: [
          {
            id: 8,
            name: "ヘッドスパ(30分)＋カット",
          },
          {
            id: 9,
            name: "眉カット",
          },
        ],
      };
      res.should.have.status(200);
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(expected);
    });
  });

  describe("DELETE /api/customers/:id", () => {
    it("should delete customerInfo by id", async () => {
      const res = await request.delete("/api/customers/3");
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.deep.equal({
        success: true,
        message: "request successfull!!",
      });
    });

    it("should return 404 if customer not found", async () => {
      const res = await request.delete("/api/customers/999");
      res.should.have.status(404);
      res.should.be.json;
      res.body.should.deep.equal({ success: false, message: "Item not found" });
    });
  });
});
