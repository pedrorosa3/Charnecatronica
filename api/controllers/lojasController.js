const db = require("../db");

// Obter todas as lojas
const getLojas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        nipc,
        nome,
        numerotelefone, 
        email, 
        moradaid
      FROM loja
      ORDER BY nome;
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
    const result = await db.query(
      `
      SELECT 
        e.numinterno AS id,
        p.nome AS nome
      FROM empregado e
      JOIN pessoa p ON e.pessoaid = p.id
      WHERE e.lojanipc = $1
      ORDER BY p.nome;
    `,
      [nipc]
    );

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
