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

const getTiposDeEquipamento = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT tipo
      FROM fichaDeEquipamento
      ORDER BY tipo;
    `);

    const tipos = result.rows.map((row) => row.tipo);
    res.status(200).json(tipos);
  } catch (error) {
    console.error("Erro ao buscar tipos:", error);
    res.status(500).json({ error: "Erro ao buscar tipos de equipamento" });
  }
};

const createFicha = async (req, res) => {
  const { codBarras, marca, modelo, tipo, precoBase, anoLancamento } = req.body;

  if (
    !codBarras ||
    !marca ||
    !modelo ||
    !tipo ||
    !precoBase ||
    !anoLancamento
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (!/^\d{13}$/.test(codBarras)) {
    return res
      .status(400)
      .json({ error: "O código de barras deve ter 13 dígitos numéricos." });
  }

  try {
    await db.query(
      `
      INSERT INTO fichaDeEquipamento (codBarras, marca, modelo, tipo, precoBase, anoLancamento)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [codBarras, marca, modelo, tipo, precoBase, anoLancamento]
    );

    res.status(201).json({ message: "Ficha criada com sucesso." });
  } catch (error) {
    console.error("Erro ao criar ficha:", error);
    if (error.code === "23505") {
      res
        .status(409)
        .json({ error: "Já existe uma ficha com esse código de barras." });
    } else {
      res.status(500).json({ error: "Erro ao criar ficha." });
    }
  }
};

const deleteFicha = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM fichaDeEquipamento WHERE codBarras = $1`, [id]);
    res.status(200).json({ message: "Ficha apagada com sucesso." });
  } catch (error) {
    console.error("Erro ao apagar ficha:", error);
    res.status(500).json({ error: "Erro ao apagar ficha." });
  }
};

const updateFicha = async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, tipo, precoBase, anoLancamento } = req.body;

  if (!marca || !modelo || !tipo || !precoBase || !anoLancamento) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    await db.query(
      `
      UPDATE fichaDeEquipamento
      SET marca = $1, modelo = $2, tipo = $3, precoBase = $4, anoLancamento = $5
      WHERE codBarras = $6
    `,
      [marca, modelo, tipo, precoBase, anoLancamento, id]
    );

    res.status(200).json({ message: "Ficha atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar ficha:", error);
    res.status(500).json({ error: "Erro ao atualizar ficha." });
  }
};

module.exports = {
  getFichas,
  getFichaById,
  getTiposDeEquipamento,
  createFicha,
  deleteFicha,
  updateFicha,
};
