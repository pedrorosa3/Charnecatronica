const db = require("../db");

// GET /fichas
const getFichas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.Cod_barras,
        f.Marca,
        f.Modelo,
        f.Tipo,
        f.Preco_base,
        f.Ano_lancamento,
        i.url
      FROM Ficha_de_Equipamento f
      LEFT JOIN (
        SELECT DISTINCT ON (cod_barras) cod_barras, url
        FROM imagens_equipamento
        ORDER BY cod_barras, id
      ) i ON f.Cod_barras = i.cod_barras
      ORDER BY f.Marca, f.Modelo;
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
        f."Cod_barras",
        f."Marca",
        f."Modelo",
        f."Tipo",
        f."Preco_base",
        f."Ano_lancamento"
      FROM "Ficha_de_Equipamento" f
      WHERE f."Cod_barras" = $1
    `,
      [id]
    );

    if (fichaResult.rows.length === 0) {
      return res.status(404).json({ error: "Ficha não encontrada" });
    }

    const ficha = fichaResult.rows[0];

    const imagensResult = await db.query(
      `SELECT url FROM imagens_equipamento WHERE cod_barras = $1`,
      [id]
    );

    const especificacoesResult = await db.query(
      `SELECT titulo, destaque FROM especificacoes WHERE cod_barras = $1`,
      [id]
    );

    ficha.nome = `${ficha.Marca} ${ficha.Modelo}`;
    ficha.categoria = ficha.Tipo;
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
