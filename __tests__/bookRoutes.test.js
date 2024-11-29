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
  const updatedBook1Data = {
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-up: Unlocking the Hidden Mathematics in Video Games",
    year: 2018
  }
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
});