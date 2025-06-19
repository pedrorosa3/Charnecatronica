const { Pool } = require("pg");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "DB_PASSWORD_REMOVED",
  database: "charnecatronica",
  port: 5432,
  
});

module.exports = pool;
