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

const createEquipamento = async (req, res) => {
  const {
    estado,
    preco,
    lojaNipc,
    codBarras,
    marca,
    modelo,
    tipo,
    precoBase,
    anoLancamento,
    imagemurl,  // <-- aqui a URL da imagem que você mencionou
  } = req.body;

  if (
    !estado ||
    preco === undefined ||
    !lojaNipc ||
    !codBarras ||
    !marca ||
    !modelo ||
    !tipo ||
    precoBase === undefined ||
    !anoLancamento ||
    !imagemurl  // imagemurl obrigatório também
  ) {
    return res.status(400).json({ error: "Campos obrigatórios em falta" });
  }

  try {
    // Verifica se fichaDeEquipamento existe
    const fichaCheck = await db.query(
      "SELECT 1 FROM fichaDeEquipamento WHERE codBarras = $1",
      [codBarras]
    );

    if (fichaCheck.rows.length === 0) {
      // Insere fichaDeEquipamento se ainda não existir
      await db.query(
        `
        INSERT INTO fichaDeEquipamento (
          codBarras, marca, modelo, tipo, precoBase, anoLancamento
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [codBarras, marca, modelo, tipo, precoBase, anoLancamento]
      );
    }

    // Busca maior numeroSequenciaLoja
    // Busca maior numeroSequenciaLoja convertendo para número
    const seqResult = await db.query(`
      SELECT MAX(CAST(numeroSequenciaLoja AS INTEGER)) AS ultimoNumero FROM equipamentos
    `);
    const ultimoNumero = seqResult.rows[0].ultimonumero || 0;
    const novoNumeroSequenciaInt = parseInt(ultimoNumero, 10) + 1;
    const novoNumeroSequencia = novoNumeroSequenciaInt.toString().padStart(4, '0'); // ex: "0018"

    // Insere novo equipamento
    const insertEquip = await db.query(
      `
      INSERT INTO equipamentos (
        estado,
        preco,
        numeroSequenciaLoja,
        lojaNipc,
        dataDeDisponibilizacao,
        codBarras
      ) VALUES ($1, $2, $3, $4, NOW(), $5)
      RETURNING id
    `,
      [estado, preco, novoNumeroSequencia, lojaNipc, codBarras]
    );


    // Insere a imagem na tabela imagensEquipamento
    await db.query(
      `
      INSERT INTO imagensEquipamento (codBarras, url)
      VALUES ($1, $2)
    `,
      [codBarras, imagemurl]
    );

    res.status(201).json({
      message: "Equipamento criado com sucesso",
      id: insertEquip.rows[0].id,
    });
  } catch (error) {
    console.error("Erro ao criar equipamento:", error);
    res.status(500).json({ error: "Erro interno ao criar equipamento" });
  }
};



module.exports = {
  getEquipamentos,
  getEquipamentoById,
  createEquipamento, // exporta novo controller
};