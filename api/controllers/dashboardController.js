const pool = require('../db');

const getInfoEmpregado = async (req, res) => {
  const { numeroEmpregado } = req.body;

  if (!numeroEmpregado) {
    return res.status(400).json({ message: "Número do empregado é obrigatório." });
  }

  try {
    const result = await pool.query(`
      SELECT e.numInterno, p.nome, p.email, p.telemovel, l.nome AS nomeloja
      FROM empregado e
      JOIN pessoa p ON e.pessoaId = p.id
      JOIN loja l ON e.lojaNipc = l.nipc
      WHERE e.numInterno = $1
    `, [numeroEmpregado]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro no backend:", error);
    res.status(500).json({ message: 'Erro ao buscar dados do funcionário' });
  }
};

module.exports = { getInfoEmpregado };
