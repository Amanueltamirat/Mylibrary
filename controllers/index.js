const express = require("express");
const Book = require("../models/book");
const indexRouters = express.Router();

indexRouters.get("/", async (req, res) => {
  let books = [];
  try {
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
  } catch {}
  res.render("index", { books: books });
});

module.exports = indexRouters;
