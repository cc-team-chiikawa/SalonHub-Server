const express = require("express");
const path = require("path");
const db = require("../database/knex");
const { OpenAIWrapper } = require("./openai");
const bodyParser = require("body-parser");

const cors = require("cors");
const { uploadFile, getFile } = require("./aws_s3");
const fs = require("fs");
const bucketName = "cc-hairstyle-image";
const devURI = "http://localhost:5173";

const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
};

const createserver = () => {
  const app = express();
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  app.use(express.json());

  const corsOptions = {
    origin: devURI, // 許可したいオリジンを指定
    credentials: true, // レスポンスヘッダーにAccess-Control-Allow-Credentialsを追加。ユーザー認証等を行う場合は、これがないとブラウザがレスポンスを捨ててしまうそう。
    optionsSuccessStatus: 200, // レスポンスのHTTPステータスコードを「200(成功)」に設定
  };
  app.use(cors(corsOptions));

  // 「/api/customers」
  // GET：顧客名（漢字、かな）、idを取得する
  app.get("/api/customers", async (req, res) => {
    try {
      const customerLists = await db
        .select("id", "name", "kana") // +CardNumber, gender
        .from("customers")
        .orderBy("id");
      res.status(200).json(customerLists);
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });

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

      /* 
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
      */

      const responseObject = {
        ...snakeCaseCustomerInfo,
        // kartes: kartesInfo,
        // genres: genresInfo,
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
        // ？？
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

  /* 
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
  */

  // 「/api/customers/login」
  // POST：リクエストボディで指定したカード番号、生年月日に一致する顧客のidを返す
  app.post("/api/customers/login", async (req, res) => {
    const searchInfo = req.body;

    try {
      const customerID = await db("customers")
        .select("id")
        .where(searchInfo)
        .first();

      if (customerID) {
        // 見つかった場合のみidを返す
        res.status(200).json(customerID);
      } else {
        // 見つからなかった場合
        // res.status(404).json({ error: "Customer not found" });
        res.status(204).send(); // 204 No Content
      }
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 「/api/image/new」
  app.post("/api/image/new", async (req, res) => {
    // OpenAIのAPIを呼び出して、画像を作成。
    // 引数：作成のためのタグの配列を含むJSON
    // {
    //  "tags": ["30歳", "女性", "日本人", "ショートカット"]
    // }
    // 戻り値：生成した画像のbase64データの配列を含むJSON
    // base64data

    const instance = new OpenAIWrapper();
    const image = await instance.generateImage(req.body.tags);
    res.status(200).send(image);
  });

  // 「/api/image/upload」
  app.post("/api/image/upload", async (req, res) => {
    // AWS S3のAPIを呼び出して、画像をアップロード
    // 引数：アップロードのためのIDの配列を含むJSON
    // {
    //  "cardNumber": "xxxxxxxxxxxxxxxx"（16桁）
    //  "image": "base64data"
    // }
    // 戻り値：アップロード結果（成功時はkeyを含める→result.key）

    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    const yyyymmdd = y + m + d;
    const key = req.body.cardNumber + "_" + yyyymmdd + ".txt";
    const uploadPath = path.join(__dirname, "/upload/");
    const file = uploadPath + key;
    // fs.writeFileSync(file, req.body.image);

    const result = await uploadFile(bucketName, file, key);

    if (result.$metadata.httpStatusCode === 200) {
      result.key = key;
      res.status(200).send(result);
    } else {
      res.status(500).send(result);
    }
  });

  /* 
  //// 以下スコープ外

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
        .where({ id: karteId })
        .first();

      const snakeCasekarteInfo = {};
      for (const key in karteInfo) {
        if (Object.prototype.hasOwnProperty.call(karteInfo, key)) {
          snakeCasekarteInfo[camelToSnake(key)] = karteInfo[key];
        }
      }

      // treatmentedMenusの取得
      const treatmentedInfo = await db
        .select("menus.id", "menus.name")
        .from("menus")
        .innerJoin("treatmentedMenus", "menus.id", "treatmentedMenus.menuId")
        .innerJoin("kartes", "treatmentedMenus.karteId", "kartes.id")
        .where("kartes.id", karteId);

      // treatmentedMenusの取得
      const interestingInfo = await db
        .select("menus.id", "menus.name")
        .from("menus")
        .innerJoin("interestingMenus", "menus.id", "interestingMenus.menuId")
        .innerJoin("kartes", "interestingMenus.karteId", "kartes.id")
        .where("kartes.id", karteId);

      const responseObject = {
        ...snakeCasekarteInfo,
        treatmented: treatmentedInfo,
        interesting: interestingInfo,
      };

      res.status(200).json(responseObject);
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });

  // PUT：カルテidに一致するカルテ情報をリクエストボディの内容で修正
  app.put("/api/kartes/:id", async (req, res) => {
    const karteId = req.params.id;
    const updatedData = req.body;

    try {
      const updateResult = await db("kartes")
        .where({ id: karteId })
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

  // 「/api/stylists」
  // GET：美容師名（漢字、かな）、役職、idを取得する
  app.get("/api/stylists", async (req, res) => {
    try {
      const customerLists = await db
        .select("id", "name", "kana", "post")
        .from("stylists")
        .orderBy("id");
      res.status(200).json(customerLists);
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });

  //「/api/stylists/:id」
  // GET：美容師idに一致する美容師情報、担当カルテIDと施術日付を取得
  app.get("/api/stylists/:id", async (req, res) => {
    const stylistID = req.params.id;
    try {
      // stylistsテーブルからの取得
      const stylistInfo = await db
        .select("*")
        .from("stylists")
        .where({ id: stylistID });

      // スネークケースに変更
      const snakeCaseStylistInfo = {};
      for (const key in stylistInfo[0]) {
        if (Object.prototype.hasOwnProperty.call(stylistInfo[0], key)) {
          snakeCaseStylistInfo[camelToSnake(key)] = stylistInfo[0][key];
        }
      }

      // kartesテーブルからの取得
      const kartesInfo = await db
        .select("id", "treatmentDay as treatment_day")
        .from("kartes")
        .where({ stylistID });

      const responseObject = {
        ...snakeCaseStylistInfo,
        kartes: kartesInfo,
      };

      res.status(200).json(responseObject);
    } catch {
      res.status(500).json({ error: "request failed" });
    }
  });
   */

  return app;
};

module.exports = createserver;
