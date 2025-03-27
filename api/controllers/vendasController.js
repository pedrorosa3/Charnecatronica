const db = require("../db"); // Importa a conexão com o PostgreSQL

const insertVenda = async (req, res) => {
  try {
    const { name, description, category, images } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Insere os dados na tabela 'vendas'
    const result = await db.query(
      "INSERT INTO vendas (name, description, category, images) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, category, JSON.stringify(images)]
    );

    res.status(201).json({ message: "Produto inserido com sucesso!", venda: result.rows[0] });
  } catch (err) {
    console.error("Erro ao inserir venda:", err);
    res.status(500).json({ error: "Erro ao inserir venda" });
  }
};

module.exports = { insertVenda };

