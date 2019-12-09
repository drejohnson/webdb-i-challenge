const express = require("express");

// database access using knex
const knex = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await knex.select("*").from("accounts");
    res.status(200).json(accounts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const account = await knex
      .select("*")
      .from("accounts")
      .where({ id })
      .first();
    res.status(200).json(account);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const accountData = req.body;
  try {
    if (!accountData.name || !accountData.budget)
      return res.status(400).send({ errorMessage: "Missing required data" });
    const ids = await knex("accounts").insert(accountData, "id");
    const id = ids[0];
    const account = await knex("accounts")
      .select("id", "name", "budget")
      .where({ id })
      .first();
    res.status(201).json(account);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  try {
    if (!req.body)
      return res.status(500).send({ errorMessage: "Missing required data" });
    const count = await knex("accounts")
      .where({ id })
      .update(changes);

    if (count === 0)
      return res.status(404).send({ errorMessage: "No Accounts found" });

    res.status(200).json({ message: `${count} record has been updated` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const count = await knex("accounts")
      .where({ id })
      .delete();

    if (count === 0)
      return res.status(404).send({ errorMessage: "No Accounts found" });
    res.status(200).json({ message: `${count} record has been deleted` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
