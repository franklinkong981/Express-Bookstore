/** Common config for bookstore. */


const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgres://franklinkong981:123456789@127.0.0.1:5432/books-test"
  : "postgres://franklinkong981:123456789@127.0.0.1:5432/books";


module.exports = { DB_URI };