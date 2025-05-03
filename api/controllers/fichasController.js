const db = require("../db");

// GET /fichas
const getFichas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.codBarras,
        f.marca,
        f.modelo,
        f.tipo,
        f.precoBase,
        f.anoLancamento,
        i.url
      FROM fichaDeEquipamento f
      LEFT JOIN (
        SELECT DISTINCT ON (codBarras) codBarras, url
        FROM imagensEquipamento
        ORDER BY codBarras, id
      ) i ON f.codBarras = i.codBarras
      ORDER BY f.marca, f.modelo;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar fichas:", error);
    res.status(500).json({ error: "Erro ao buscar fichas de equipamento" });
  }
};

// GET /fichas/:id
const getFichaById = async (req, res) => {
  const { id } = req.params;

  try {
    const fichaResult = await db.query(
      `
      SELECT 
        f.codBarras,
        f.marca,
        f.modelo,
        f.tipo,
        f.precoBase,
        f.anoLancamento
      FROM fichaDeEquipamento f
      WHERE f.codBarras = $1
    `,
      [id]
    );

    if (fichaResult.rows.length === 0) {
      return res.status(404).json({ error: "Ficha não encontrada" });
    }

    const ficha = fichaResult.rows[0];

    const imagensResult = await db.query(
      `SELECT url FROM imagensEquipamento WHERE codBarras = $1`,
      [id]
    );

    const especificacoesResult = await db.query(
      `SELECT titulo, destaque FROM especificacoes WHERE codBarras = $1`,
      [id]
    );

    ficha.nome = `${ficha.marca} ${ficha.modelo}`;
    ficha.categoria = ficha.tipo;
    ficha.imagens = imagensResult.rows.map((img) => img.url);
    ficha.especificacoes = especificacoesResult.rows;
    ficha.imagemUrl = ficha.imagens[0] || null;
    ficha.avaliacao = 4.2; // mock
    ficha.reviews = "837 Reviews"; // mock

    res.status(200).json(ficha);
  } catch (error) {
    console.error("Erro ao buscar ficha por ID:", error);
    res.status(500).json({ error: "Erro ao buscar ficha de equipamento" });
  }
};

module.exports = {
  getFichas,
  getFichaById,
};
