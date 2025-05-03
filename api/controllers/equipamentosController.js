const db = require("../db"); // conexão com PostgreSQL

const getEquipamentos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id,
        e.estado,
        e.preco,
        e.numeroSequenciaLoja,
        e.dataDeDisponibilizacao,
        f.marca,
        f.modelo,
        f.tipo,
        f.codBarras,
        COALESCE(i.url, '') AS imagem
      FROM equipamentos e
      JOIN fichaDeEquipamento f ON e.codBarras = f.codBarras
      LEFT JOIN (
        SELECT DISTINCT ON (codBarras) codBarras, url
        FROM imagensEquipamento
        ORDER BY codBarras, id
      ) i ON f.codBarras = i.codBarras
    `);

    const equipamentos = result.rows.map((equip) => ({
      ...equip,
      nome: `${equip.marca} ${equip.modelo}`,
      categoria: equip.tipo,
      avaliacao: 4 + Math.random(), // Mock
      reviews: `${Math.floor(Math.random() * 1000 + 200)} Reviews`, // Mock
    }));

    res.json(equipamentos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar equipamentos" });
  }
};

const getEquipamentoById = async (req, res) => {
  const { id } = req.params;

  try {
    const equipamentoResult = await db.query(
      `
      SELECT 
        e.id,
        e.estado,
        e.preco,
        e.numeroSequenciaLoja,
        e.dataDeDisponibilizacao,
        f.codBarras,
        f.marca,
        f.modelo,
        f.tipo,
        f.precoBase,
        f.anoLancamento
      FROM equipamentos e
      JOIN fichaDeEquipamento f ON e.codBarras = f.codBarras
      WHERE e.id = $1
    `,
      [id]
    );

    if (equipamentoResult.rows.length === 0) {
      return res.status(404).json({ error: "Equipamento não encontrado" });
    }

    const equipamento = equipamentoResult.rows[0];

    const imagensResult = await db.query(
      "SELECT url FROM imagensEquipamento WHERE codBarras = $1",
      [equipamento.codbarras]
    );

    const especificacoesResult = await db.query(
      "SELECT titulo, destaque FROM especificacoes WHERE codBarras = $1",
      [equipamento.codbarras]
    );

    equipamento.nome = `${equipamento.marca} ${equipamento.modelo}`;
    equipamento.categoria = equipamento.tipo;
    equipamento.imagens = imagensResult.rows.map((img) => img.url);
    equipamento.especificacoes = especificacoesResult.rows;
    equipamento.avaliacao = 4.5; // mock
    equipamento.reviews = "1.2k Reviews"; // mock

    res.json(equipamento);
  } catch (err) {
    console.error("Erro ao buscar equipamento:", err);
    res.status(500).json({ error: "Erro interno ao buscar equipamento" });
  }
};

module.exports = {
  getEquipamentos,
  getEquipamentoById,
};
