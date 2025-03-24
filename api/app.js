const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão à base de dados PostgreSQL
const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "DB_PASSWORD_REMOVED",
  database: "charnecatronica",
  port: 5432,
});

// Teste de conexão
pool.connect((err) => {
  if (err) {
    console.error("🔴 Erro ao conectar ao PostgreSQL:", err);
    return;
  }
  console.log("🟢 Conectado ao PostgreSQL");
});

// Rota de exemplo
app.get("/api/equipamentos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipamentos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar equipamentos" });
  }
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

module.exports = app;
