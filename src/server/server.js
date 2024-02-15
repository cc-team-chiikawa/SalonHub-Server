const express = require("express");
const path = require("path");
const db = require("../database/knex");

const testCustomers = [
  { id: 1, name: "田中陽平" },
  { id: 2, name: "高橋朱美" },
];

const createserver = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/customers", async (req, res) => {
    // const result = await db.select().from("customers");
    res.status(200).json(testCustomers);
  });

  return app;
};

module.exports = createserver;
