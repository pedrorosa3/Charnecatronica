const pool = require('../db');

const getInfoEmpregado = async (req, res) => {
  const { numeroEmpregado } = req.body;

  if (!numeroEmpregado) {
    return res.status(400).json({ message: "Número do empregado é obrigatório." });
  }

  try {
    // Dados do funcionário
    const funcionarioResult = await pool.query(`
      SELECT e.numInterno, p.nome, p.email, p.telemovel, l.nome AS nomeloja
      FROM empregado e
      JOIN pessoa p ON e.pessoaId = p.id
      JOIN loja l ON e.lojaNipc = l.nipc
      WHERE e.numInterno = $1
    `, [numeroEmpregado]);

    if (funcionarioResult.rows.length === 0) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    // Dados do dashboard (exemplo, ajusta conforme teu DB)
    const produtosStockResult = await pool.query(`SELECT COUNT(*) AS total FROM equipamentos`);
    const reparacoesResult = await pool.query(`SELECT COUNT(*) AS total FROM reparacao WHERE estado = 'Por orçamentar'`);
    const clientesResult = await pool.query(`SELECT COUNT(*) AS total FROM cliente`);
    const projetosResult = await pool.query(`SELECT COUNT(*) AS total FROM projetoBeneficencia`);

    const funcionario = funcionarioResult.rows[0];

    const dadosDashboard = {
      produtosStock: produtosStockResult.rows[0].total || 0,
      reparacoes: reparacoesResult.rows[0].total || 0,
      clientes: clientesResult.rows[0].total || 0,
      projetosBeneficencia: projetosResult.rows[0].total || 0,
    };

    res.json({
      ...funcionario,
      ...dadosDashboard
    });

  } catch (error) {
    console.error("Erro no backend:", error);
    res.status(500).json({ message: 'Erro ao buscar dados do funcionário e dashboard' });
  }
};

module.exports = { getInfoEmpregado };
