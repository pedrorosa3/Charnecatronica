const db = require("../db");

// Criar uma nova compra
const insertCompra = async (req, res) => {
  const {
    preco,
    clienteId,
    empregadoId,
    lojaNipc,
    estado,
    modelo,
    metodoPagamento,
  } = req.body;

  if (
    !preco ||
    !clienteId ||
    !empregadoId ||
    !lojaNipc ||
    !estado ||
    !modelo ||
    !metodoPagamento
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  console.log("Modelo recebido (antes da normalização):", modelo);
  const modeloNormalizado = modelo.trim();
  console.log("Modelo normalizado:", modeloNormalizado);

  try {
    const result = await db.query(
      `SELECT codBarras FROM fichaDeEquipamento WHERE modelo = $1`,
      [modeloNormalizado]
    );

    console.log("Resultado da consulta codBarras:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Modelo não encontrado" });
    }

    const codBarras = result.rows[0].codbarras;
    console.log("Código de barras encontrado:", codBarras);

    const compraResult = await db.query(
      `INSERT INTO compra (data, preco, clienteId, empregadoId, lojaNipc, estado, metodoPagamento, codBarras)
       VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        preco,
        clienteId,
        empregadoId,
        lojaNipc,
        estado,
        metodoPagamento,
        codBarras,
      ]
    );

    res.status(201).json({
      message: "Compra registada com sucesso!",
      compra: compraResult.rows[0],
    });
  } catch (err) {
    console.error("Erro ao registar compra:", err);
    res.status(500).json({ error: "Erro ao registar compra" });
  }
};

module.exports = {
  insertCompra,
};
