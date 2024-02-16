const express = require("express");
const path = require("path");
const db = require("../database/knex");

const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
};

const createserver = () => {
  const app = express();
  app.use(express.json());

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
    } catch (error) {
      console.error(error);
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

      // スネークケースに変更
      const snakeCaseCustomerInfo = {};
      for (const key in customerInfo[0]) {
        if (Object.prototype.hasOwnProperty.call(customerInfo[0], key)) {
          snakeCaseCustomerInfo[camelToSnake(key)] = customerInfo[0][key];
        }
      }

      // kartesテーブルからの取得
      const kartesInfo = await db
        .select("id", "treatmentDay as treatment_day")
        .from("kartes")
        .where({ customerId });

      // genresテーブルからの取得
      const genresInfo = await db
        .select("genres.id", "genres.name")
        .from("genres")
        .innerJoin("customersGenres", "genres.id", "customersGenres.genreId")
        .innerJoin("customers", "customersGenres.customerId", "customers.id")
        .where("customers.id", customerId);

      const responseObject = {
        ...snakeCaseCustomerInfo,
        kartes: kartesInfo,
        genres: genresInfo,
      };

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
      const updateResult = await db("customers")
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

  // DELETE：顧客idに一致する顧客情報を削除
  app.delete("/api/customers/:id", async (req, res) => {
    const customerId = req.params.id;
    try {
      // 削除対象が見つかったか判断するため、カウントする
      const delCount = await db("customers").where({ id: customerId }).delete();

      if (delCount > 0) {
        // カウントできているため、成功を返す
        res
          .status(200)
          .json({ success: true, message: "request successfull!!" });
      } else {
        // カウントできていないため、削除対象なし
        res.status(404).json({ success: false, message: "Item not found" });
      }
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });

  // 「/api/customers/login」
  // POST：リクエストボディで指定したカード番号、生年月日に一致する顧客のidを返す
  app.post("/api/customers/login", async (req, res) => {
    const serchInfo = req.body;

    try {
      const customerID = await db("customers")
        .select("id")
        .where(serchInfo)
        .first();

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
