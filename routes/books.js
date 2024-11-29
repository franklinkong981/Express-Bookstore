const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const Book = require("../models/book");
const ExpressError = require("../expressError");
const createBookSchema = require("../schemas/createBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");
const updatePartialBookSchema = require("../schemas/updatePartialBookSchema.json");

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const requestValidation = jsonschema.validate(req.body, createBookSchema);
    if (!requestValidation.valid) {
      const listOfErrors = requestValidation.errors.map(e => e.stack);
      throw new ExpressError(listOfErrors, 400);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const requestValidation = jsonschema.validate(req.body, updateBookSchema);
    if (!requestValidation.valid) {
      const listOfErrors = requestValidation.errors.map(e => e.stack);
      throw new ExpressError(listOfErrors, 400);
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.put("/partial_update/:isbn", async function (req, res, next) {
  try {
    const requestValidation = jsonschema.validate(req.body, updatePartialBookSchema);
    if (!requestValidation.valid) {
      const listOfErrors = requestValidation.errors.map(e => e.stack);
      throw new ExpressError(listOfErrors, 400);
    }

    const book = await Book.updatePart(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
