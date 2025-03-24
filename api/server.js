const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // ✅ Correto para PostgreSQL

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

// Criar conexão com o PostgreSQL
const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres", // ⚠️ PostgreSQL normalmente usa "postgres" como usuário padrão
  password: "DB_PASSWORD_REMOVED", // Sua senha do PostgreSQL
  database: "charnecatronica",
  port: 5432, // Porta do PostgreSQL
});

// Testar conexão
pool.connect((err) => {
  if (err) {
    console.error("🔴 Erro ao conectar ao PostgreSQL:", err);
    return;
  }
  console.log("🟢 Conectado ao PostgreSQL");
});

// Rota para buscar equipamentos
app.get("/equipamentos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipamentos");
    res.json(result.rows); // PostgreSQL usa `.rows`
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar equipamentos" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

