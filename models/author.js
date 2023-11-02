const mongoose = require("mongoose");
const Book = require("./book");
const Schima = mongoose.Schema;
const AuthorSchima = new Schima({
  name: {
    type: String,
    required: true,
  },
});

AuthorSchima.pre("delete", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error("This author has still a books"));
    } else {
      next();
    }
  });
});
module.exports = mongoose.model("Author", AuthorSchima);
