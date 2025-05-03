const db = require("../db");

// Obter todos os clientes com informações da pessoa
const getClientesLista = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.id AS clienteId,
        p.nome AS nome,
        p.email,
        p.telemovel AS telefone
      FROM cliente c
      JOIN pessoa p ON c.pessoaId = p.id
      ORDER BY p.nome;
    `);

    res.status(200).json(result.rows); // Envia os dados dos clientes como resposta
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
};

module.exports = {
  getClientesLista,
};
