const db = require("../db");

// Obter todas as lojas
const getLojas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        NIPC AS nipc,
        Nome AS nome,
        NumeroTelefone, 
        Email, 
        MoradaID
      FROM Loja
      ORDER BY Nome;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar lojas:", error);
    res.status(500).json({ error: "Erro ao buscar lojas" });
  }
};

// Obter empregados por loja (usando o NIPC)
const getEmpregadosByLoja = async (req, res) => {
  const { nipc } = req.params;

  try {
    const result = await db.query(`
      SELECT 
        e.NumInterno AS id,
        p.Nome AS nome
      FROM Empregado e
      JOIN Pessoa p ON e.PessoaID = p.ID
      WHERE e.LojaNIPC = $1
      ORDER BY p.Nome;
    `, [nipc]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar empregados da loja:", error);
    res.status(500).json({ error: "Erro ao buscar empregados da loja" });
  }
};

module.exports = {
  getLojas,
  getEmpregadosByLoja,
};
