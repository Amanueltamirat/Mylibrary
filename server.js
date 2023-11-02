if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const methodIverride = require("method-override");
const bodyParcer = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/index");
const authorsRouter = require("./routes/author");
const booksRouter = require("./routes/book");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (err) => console.error(err));
db.once("open", () => console.log("DB connected"));

app.use(methodIverride("_method"));
app.use(bodyParcer.urlencoded({ limit: "20mb", extended: false }));
app.use(expressLayouts);
app.use(express.static("public"));
app.use("/", indexRouter);
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

app.listen(process.env.PORT || 5000);
