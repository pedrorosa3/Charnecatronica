const db = require("../db"); // Conexão com o PostgreSQL

const insertCompra = async (req, res) => {
  try {
    const { preco, clienteid, empregadoID, lojaNIPC, equipamentoID } = req.body;

    if (!preco || !clienteid || !empregadoID || !lojaNIPC || !equipamentoID) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const result = await db.query(
      `INSERT INTO Compra (Data, Preco, ClienteID, EmpregadoID, LojaNIPC, EquipamentoID)
       VALUES (NOW(), $1, $2, $3, $4, $5)
       RETURNING *`,
      [preco, clienteid, empregadoID, lojaNIPC, equipamentoID]
    );

    res.status(201).json({
      message: "Compra registada com sucesso!",
      compra: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao registar compra:", err);
    res.status(500).json({ error: "Erro ao registar compra" });
  }
};

module.exports = { insertCompra };


