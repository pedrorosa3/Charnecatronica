const db = require("../db");

// Criar uma nova compra
const insertCompra = async (req, res) => {
  const { preco, clienteid, empregadoID, lojaNIPC, estado, modelo, metodoPagamento } = req.body;

  // Verificar se todos os campos foram preenchidos
  if (!preco || !clienteid || !empregadoID || !lojaNIPC || !estado || !modelo || !metodoPagamento) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  console.log('Modelo recebido (antes da normalização):', modelo);
  const modeloNormalizado = modelo.trim();
  console.log('Modelo normalizado:', modeloNormalizado);

  try {
    const result = await db.query(
      `SELECT Cod_barras FROM Ficha_de_Equipamento WHERE modelo = '${modeloNormalizado}'`
    );

    console.log('Resultado da consulta Cod_barras:', result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Modelo não encontrado" });
    }

    const Cod_barras = result.rows[0].cod_barras;
    console.log('Código de barras encontrado:', Cod_barras);

    // Inserir a compra no banco de dados, agora com MetodoPagamento
    const compraResult = await db.query(
      `INSERT INTO Compra (Data, Preco, ClienteID, EmpregadoID, LojaNIPC, Estado, MetodoPagamento, Cod_barras)
       VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [preco, clienteid, empregadoID, lojaNIPC, estado, metodoPagamento, Cod_barras]
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




