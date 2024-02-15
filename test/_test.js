const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const createserver = require("../src/server/server");
chai.should();

const server = createserver();

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
});
