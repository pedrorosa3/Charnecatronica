const { Pool } = require("pg");

const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "DB_PASSWORD_REMOVED",
  database: "charnecatronica",
  port: 5432,
});

module.exports = pool;
