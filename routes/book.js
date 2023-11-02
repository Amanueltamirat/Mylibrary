const express = require("express");
const Book = require("../models/book");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Author = require("../models/author");
// const author = require("../models/author");
const uploadPath = path.join("public", Book.coverImageBasePath);

const imageMimeType = ["images/png", "images/gif", "images/jpg"];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

// All books
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title !== null && req.query.title !== "") {
    searchOptions.title = RegExp(req.query.title, "i");
  }
  try {
    const books = await Book.find(searchOptions);
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//New books
router.get("/new", async (req, res) => {
  // let searchBook;
  try {
    const authors = await Author.find({});
    const books = new Book();
    res.render("books/new", {
      book: books,
      authors: authors,
    });
  } catch {
    res.redirect("/books");
  }
});

//Create books
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishedDate: new Date(req.body.publishedDate),
    description: req.body.description,
    pageCount: req.body.pageCount,
    coverImageName: fileName,
  });
  try {
    const newBook = book.save();
    res.redirect(`books/${newBook.id}`);
  } catch {
    res.redirect("books/new", {
      book: book,
      errorMessage: "Error Creating Book",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/show", {
      book: book,
    });
  } catch {
    res.redirect("/");
  }
});
//Edit Book
router.get("/:id/edit", async (req, res) => {
  try {
    const authors = await Author.find({});
    const books = await Book.findById(req.params.id);
    res.render("books/edit", {
      book: books,
      authors: authors,
    });
  } catch {
    res.redirect("/");
  }
});
//Update Book Route
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishedDate = new Date(req.body.publishedDate);
    book.description = req.body.description;
    book.pageCount = req.body.pageCount;

    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch {
    if (book != null) {
      res.redirect("books/new", {
        book: book,
        errorMessage: "Error Updating Book",
      });
    } else {
      res.redirect("/");
    }
  }
});
//delete Books
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findByIdAndDelete(req.params.id);
    // await author.remove();
    res.redirect(`/books`);
  } catch {
    if (book == null) {
      res.redirect("/");
    } else {
      res.redirect(`/books/${book.id}`);
    }
  }
});
module.exports = router;
