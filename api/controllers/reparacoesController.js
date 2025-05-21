const pool = require("../db");

exports.getAllReparacoes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reparacao");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

exports.createReparacao = async (req, res) => {
  const {
    dataEntregaAoCliente,
    numPedidoOrcamento,
    descNaoFunciona,
    orcamentoReparacao,
    clienteId,
    empregadoId,
    codBarras, // substitui equipamentoId
    lojaNipc,
    compraId,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reparacao (
        dataEntregaAoCliente, numPedidoOrcamento, descNaoFunciona,
        orcamentoReparacao, clienteId, empregadoId,
        codBarras, lojaNipc, compraId
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        dataEntregaAoCliente,
        numPedidoOrcamento,
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

exports.updateReparacao = async (req, res) => {
  const {
    dataEntregaAoCliente,
    numPedidoOrcamento,
    descNaoFunciona,
    orcamentoReparacao,
    clienteId,
    empregadoId,
    codBarras, // substitui equipamentoId
    lojaNipc,
    compraId,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reparacao SET
        dataEntregaAoCliente = $1,
        numPedidoOrcamento = $2,
        descNaoFunciona = $3,
        orcamentoReparacao = $4,
        clienteId = $5,
        empregadoId = $6,
        codBarras = $7,
        lojaNipc = $8,
        compraId = $9
      WHERE id = $10 RETURNING *`,
      [
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
