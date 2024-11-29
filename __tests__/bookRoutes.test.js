process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes tests", function() {
  const book1Data = {
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
  };
  let book1;

  beforeEach(async function() {
    book1 = await Book.create(book1Data);
  });

  afterEach(async function() {
    await db.query("DELETE FROM books");
  });

  afterAll(async function() {
    await db.end();
  });

  describe("GET /books tests", function() {
    test("Can get book data", async function() {
      let response = await request(app).get("/books");

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({books: [book1]});
    });
  });

  describe("GET /books/isbn tests", function() {
    test("Can get book data for an existing book", async function() {
      let response = await request(app).get(`/books/${book1Data.isbn}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({book: book1});
    });
    test("Invalid id will return an error", async function() {
      let response = await request(app).get(`/books/1`);

      expect(response.statusCode).toEqual(404);
    });
  });

  describe("POST /books tests", function() {
    test("Can successfully add a new book", async function() {
      const franklinsBook = {
        isbn: "123456789",
        amazon_url: "http://a.co/eobPtX2",
        author: "Franklin Kong",
        language: "english",
        pages: 100,
        publisher: "Springboard Publishing",
        title: "The Adventures of Onion",
        year: 2024
      }
      let response = await request(app).post(`/books`).send(franklinsBook);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({book: franklinsBook});
    });

    test("Can't add a new book if it's missing a year", async function() {
      let response = await request(app).post(`/books`).send({
        isbn: "123456789",
        amazon_url: "http://a.co/eobPtX2",
        author: "Franklin Kong",
        language: "english",
        pages: 100,
        publisher: "Springboard Publishing",
        title: "The Adventures of Onion"
      });

      expect(response.statusCode).toEqual(400);
    });

    test("Can't add a new book if the year is of the wrong format", async function() {
      let response = await request(app).post(`/books`).send({
        isbn: "123456789",
        amazon_url: "http://a.co/eobPtX2",
        author: "Franklin Kong",
        language: "english",
        pages: 100,
        publisher: "Springboard Publishing",
        title: "The Adventures of Onion",
        year: "2018"
      });

      expect(response.statusCode).toEqual(400);
    });
  });

  describe("PUT /books/[isbn] tests", function() {
    test("Can successfully update a book with the right body", async function() {
      let response = await request(app).put(`/books/${book1Data.isbn}`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
        year: 2018
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body.book.year).toEqual(2018);
    });

    test("Can't update a book if you're missing the year", async function() {
      let response = await request(app).put(`/books/${book1Data.isbn}`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games"
      });

      expect(response.statusCode).toEqual(400);
    });

    test("Can't update a book if the year is of a wrong format", async function() {
      let response = await request(app).put(`/books/${book1Data.isbn}`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
        year: "2018"
      });

      expect(response.statusCode).toEqual(400);
    });

    test("Can't update a book if the isbn is wrong", async function() {
      let response = await request(app).put(`/books/1`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
        year: 2018
      });

      expect(response.statusCode).toEqual(404);
    });
  });

  describe("PUT /books/partial_update[isbn] tests", function() {
    test("Can successfully update a book while missing some parts of the body", async function() {
      let response = await request(app).put(`/books/partial_update/${book1Data.isbn}`).send({
        amazon_url: "http://a.co/eobPtX2",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
        year: 2018
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body.book.author).toEqual("Matthew Lane");
      expect(response.body.book.year).toEqual(2018);
    });

    test("Can successfully update a book even with an empty body", async function() {
      let response = await request(app).put(`/books/partial_update/${book1Data.isbn}`).send({});

      expect(response.statusCode).toEqual(200);
      expect(response.body.book.author).toEqual("Matthew Lane");
      expect(response.body.book.year).toEqual(2017);
    });

    test("Can't update a book if the year is of a wrong format", async function() {
      let response = await request(app).put(`/books/${book1Data.isbn}`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
        year: "2018"
      });

      expect(response.statusCode).toEqual(400);
    });

    test("Can't update a book if the isbn is wrong", async function() {
      let response = await request(app).put(`/books/1`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
        year: 2018
      });

      expect(response.statusCode).toEqual(404);
    });
  });

  describe("DELETE /books/[isbn] tests", function() {
    test("Can successfully delete a book", async function() {
      let response = await request(app).delete(`/books/${book1Data.isbn}`);

      expect(response.statusCode).toEqual(200);

      response = await request(app).get(`/books`);
      expect(response.body.books.length).toEqual(0);
    });

    test("Can't delete a book with an invalid isbn", async function() {
      let response = await request(app).delete(`/books/1`);

      expect(response.statusCode).toEqual(404);

      response = await request(app).get(`/books`);
      expect(response.body.books.length).toEqual(1);
    });
  });
});