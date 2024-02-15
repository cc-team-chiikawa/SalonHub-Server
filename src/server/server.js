const express = require("express");
const path = require("path");
const db = require("../database/knex");

const testCustomers = [
  { id: 1, name: "田中陽平" },
  { id: 2, name: "高橋朱美" },
];

const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
};

const createserver = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/customers", async (req, res) => {
    // const result = await db.select().from("customers");
    res.status(200).json(testCustomers);
  });

  // 「/api/customers」
  // POST：顧客情報を追加する
  app.post("/api/customers", async (req, res) => {
    const postCustomer = req.body;
    try {
      const newCustomer = await db("customers")
        .insert(postCustomer)
        // 挿入された行のデータを返す
        .returning("*");
      res.status(201).json(newCustomer[0]);
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 「/api/customers/:id」
  // GET：顧客idに一致する顧客情報、気になっているジャンル、カルテIDと施術日付を取得
  app.get("/api/customers/:id", async (req, res) => {
    const customerId = req.params.id;
    try {
      // customerテーブルからの取得
      const customerInfo = await db
        .select("*")
        .from("customers")
        .where({ id: customerId });
      console.log("customerInfo:", customerInfo);

      // スネークケースに変更
      const snakeCaseCustomerInfo = customerInfo.map((customer) => {
        // スネークケース変換後のobjectを入れるためのnewCustomerを準備
        const newCustomer = {};
        for (const key in customer) {
          if (Object.prototype.hasOwnProperty.call(customer, key)) {
            newCustomer[camelToSnake(key)] = customer[key];
          }
        }
        return newCustomer;
      });

      // kartesテーブルからの取得
      const kartesInfo = await db
        .select("id as kartes_id", "treatmentDay as treatment_day")
        .from("kartes")
        .where({ customerId });
      console.log("kartesInfo:", kartesInfo);

      // genresテーブルからの取得
      const genresInfo = await db
        .select("genres.name as genre_name")
        .from("genres")
        .innerJoin("customersGenres", "genres.id", "customersGenres.genreId")
        .innerJoin("customers", "customersGenres.customerId", "customers.id")
        .where("customers.id", customerId);
      console.log("genresInfo:", genresInfo);

      const responseObject = [
        { ...snakeCaseCustomerInfo[0] },
        { ...kartesInfo },
        { ...genresInfo },
      ];
      // const responseObject = {
      //   customer: snakeCaseCustomerInfo[0],
      //   kartes: kartesInfo.length > 0 ? kartesInfo : [],
      //   genres: genresInfo.length > 0 ? genresInfo : [],
      // };

      res.status(200).json(responseObject);
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });

  // PUT：顧客idに一致する顧客情報をリクエストボディの内容で修正
  app.put("/api/customers/:id", async (req, res) => {
    const customerId = req.params.id;
    const updatedData = req.body;

    try {
      const updatedResult = await db("customers")
        .where({ id: customerId })
        .update(updatedData);

      if (updateResult === 1) {
        // 更新対象があった場合
        res.status(200).json({ message: "Record updated successfully" });
      } else {
        // 更新対象がない場合
        res.status(404).json({ error: "Record not found" });
      }
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 「/api/customers/login」
  // POST：リクエストボディで指定したカード番号、生年月日に一致する顧客のidを返す
  app.post("/api/customers/login", async (req, res) => {
    const serchInfo = req.body;

    try {
      const customerID = await db("customers").select("id").where(serchInfo);

      if (customerID) {
        // 見つかった場合のみidを返す
        res.status(200).json({ customerID });
      } else {
        // 見つからなかった場合
        res.status(404).json({ error: "Customer not found" });
      }
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 「/api/kartes」
  // POST：カルテを追加する
  app.post("/api/kartes", async (req, res) => {
    const postkarte = req.body;
    try {
      const newkarte = await db("kartes")
        .insert(postkarte)
        // 挿入された行のデータを返す
        .returning("*");
      res.status(201).json(newkarte[0]);
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 「/api/kartes/id」
  // GET：カルテidに一致するカルテ情報を取得
  app.get("/api/kartes/:id", async (req, res) => {
    const karteId = req.params.id;
    try {
      const karteInfo = await db
        .select("*")
        .from("kartes")
        .where({ id: karteId });
      const snakeCasekarteInfo = karteInfo.map((karte) => {
        // スネークケース変換後のobjectを入れるためのnewCustomerを準備
        const newkarte = {};
        for (const key in karte) {
          if (Object.prototype.hasOwnProperty.call(karte, key)) {
            newkarte[camelToSnake(key)] = karte[key];
          }
        }
        return newkarte;
      });
      res.status(200).json(snakeCasekarteInfo);
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });

  return app;
};

module.exports = createserver;
