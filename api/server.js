const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 9000;

// Configuração do CORS para permitir chamadas do frontend
app.use(cors());
app.use(express.json());

// Criar conexão com o MySQL local
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Substitua pelo seu usuário MySQL
  password: "", // Se configurou senha, coloque aqui
  database: "PTI DB",
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error("🔴 Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("🟢 Conectado ao MySQL local");
});

// Rota para buscar produtos
app.get("/equipamentos", (req, res) => {
  const sql = "SELECT * FROM equipamentos";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
    res.json(result);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
