const express = require("express");
const indexRouters = express.Router();

indexRouters.get("/", (req, res) => {
  res.render("index");
});

module.exports = indexRouters;
