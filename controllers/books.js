const express = require("express");
const indexRouters = express.Router();
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");
const uploadPath = path.join("public", Book.coverImageBasePath);
const Author = require("../models/author");
const multer = require("multer");
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});
//All books route
indexRouters.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query.regex("title", RegExp(req.query.title, "i"));
  }
  if (req.query.PublishedBefore != null && req.query.PublishedBefore != "") {
    query.lte("publishDate", req.query.PublishedBefore);
  }
  if (req.query.PublishedAfter != null && req.query.PublishedAfter != "") {
    query.gte("publishDate", req.query.PublishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books: books,
      searchOption: req.query,
    });
  } catch {}
});

// new books route
indexRouters.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});
//Create books route
indexRouters.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    author: req.body.author,
    coverImageName: fileName,
    description: req.body.description,
  });
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect("books");
  } catch {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
  }
});
function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error Creating Book";
    const books = new Book();
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}
module.exports = indexRouters;
