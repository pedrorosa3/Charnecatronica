const db = require("../db"); // tua conexão com o PostgreSQL

const getEquipamentos = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM equipamentos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar equipamentos" });
  }
};

module.exports = { getEquipamentos };
