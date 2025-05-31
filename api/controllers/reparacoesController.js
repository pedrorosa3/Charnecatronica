const pool = require("../db");

// Obter todas as reparações
exports.getAllReparacoes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reparacao");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter uma reparação por ID
exports.getReparacaoById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reparacao WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reparação não encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar nova reparação
exports.createReparacao = async (req, res) => {
  const {
    dataRececaoEquipamento,
    dataEntregaAoCliente,
    descNaoFunciona,
    orcamentoReparacao,
    clienteId,
    empregadoId,
    codBarras,
    lojaNipc,
    compraId,
  } = req.body;

  try {
    // 1. Buscar o maior número de orçamento da loja
    const maxResult = await pool.query(
      `SELECT COALESCE(MAX(numPedidoOrcamento), 0) AS ultimo FROM reparacao WHERE lojaNipc = $1`,
      [lojaNipc]
    );
    const novoNumero = maxResult.rows[0].ultimo + 1;

    // 2. Inserir nova reparação com o número calculado
    const result = await pool.query(
      `INSERT INTO reparacao (
        dataRececaoEquipamento, dataEntregaAoCliente, numPedidoOrcamento,
        descNaoFunciona, orcamentoReparacao, clienteId, empregadoId,
        codBarras, lojaNipc, compraId
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        dataRececaoEquipamento,
        dataEntregaAoCliente,
        novoNumero,
        descNaoFunciona,
        orcamentoReparacao,
        clienteId,
        empregadoId,
        codBarras,
        lojaNipc,
        compraId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar uma reparação existente
exports.updateReparacao = async (req, res) => {
  const {
    dataRececaoEquipamento,
    dataEntregaAoCliente,
    numPedidoOrcamento,
    descNaoFunciona,
    orcamentoReparacao,
    clienteId,
    empregadoId,
    codBarras,
    lojaNipc,
    compraId,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reparacao SET
        dataRececaoEquipamento = $1,
        dataEntregaAoCliente = $2,
        numPedidoOrcamento = $3,
        descNaoFunciona = $4,
        orcamentoReparacao = $5,
        clienteId = $6,
        empregadoId = $7,
        codBarras = $8,
        lojaNipc = $9,
        compraId = $10
      WHERE id = $11 RETURNING *`,
      [
        dataRececaoEquipamento,
        dataEntregaAoCliente,
        numPedidoOrcamento,
        descNaoFunciona,
        orcamentoReparacao,
        clienteId,
        empregadoId,
        codBarras,
        lojaNipc,
        compraId,
        req.params.id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reparação não encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar uma reparação
exports.deleteReparacao = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM reparacao WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reparação não encontrada" });
    }
    res.json({ message: "Reparação eliminada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
