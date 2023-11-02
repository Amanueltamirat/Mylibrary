const express = require("express");
const Author = require("../models/author");
const Book = require("../models/book");
const router = express.Router();
// All Authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name !== null && req.query.name !== "") {
    searchOptions.name = RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//New Authors
router.get("/new", (req, res) => {
  res.render("authors/new", {
    authors: new Author(),
  });
});

//Create Authors
router.post("/", async (req, res) => {
  const authors = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await authors.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render("authors/new", {
      authors: authors,
      errorMessage: "Error Creating Author",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(5).exec();
    res.render("authors/show", {
      author: author,
      bookByAuthor: books,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", {
      authors: author,
    });
  } catch {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let authors;
  try {
    authors = await Author.findById(req.params.id);
    authors.name = req.body.name;
    authors.save();
    res.redirect(`/authors/${authors.id}`);
  } catch {
    if (authors == null) {
      res.redirect("/");
    } else {
      res.render("authors/new", {
        authors: authors,
        errorMessage: "Error Updating Author",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findByIdAndDelete(req.params.id);
    // await author.remove();
    res.redirect(`/authors`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});
module.exports = router;
