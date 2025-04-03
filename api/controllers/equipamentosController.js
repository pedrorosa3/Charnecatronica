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

const getEquipamentoById = async (req, res) => {
  const { id } = req.params;

  try {
    const equipamentoRes = await db.query(
      "SELECT * FROM equipamentos WHERE id = $1",
      [id]
    );

    if (equipamentoRes.rows.length === 0) {
      return res.status(404).json({ error: "Equipamento não encontrado" });
    }

    const imagensRes = await db.query(
      "SELECT url FROM imagens_equipamento WHERE equipamento_id = $1",
      [id]
    );

    const equipamento = equipamentoRes.rows[0];
    equipamento.imagens = imagensRes.rows.map((row) => row.url);

    res.json(equipamento);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar equipamento por ID" });
  }
};

module.exports = {
  getEquipamentos,
  getEquipamentoById,
};
