const { Pool } = require("pg");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });



console.log('HOST:', process.env.DB_HOST);
console.log('USER:', process.env.DB_USER);
console.log('PWD:', process.env.DB_PASSWORD);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = pool;
