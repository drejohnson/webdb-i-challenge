const express = require("express");

const AccountRoutes = require("./accounts/account-router.js");

const server = express();

server.use(express.json());

server.use("/api/accounts", AccountRoutes);

server.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

module.exports = server;
