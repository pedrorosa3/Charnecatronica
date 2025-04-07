const db = require("../db");

// Obter todos os clientes com informações da pessoa
const getClientesLista = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        C.ID AS clienteID,
        P.Nome AS nome,
        P.Email,
        P.Telemovel AS telefone
      FROM Cliente C
      JOIN Pessoa P ON C.PessoaID = P.ID
      ORDER BY P.Nome;
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

