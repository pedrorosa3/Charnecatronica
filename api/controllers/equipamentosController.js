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
    const equipamentoResult = await db.query(
      "SELECT * FROM equipamentos WHERE id = $1",
      [id]
    );

    const imagensResult = await db.query(
      "SELECT url FROM imagens_equipamento WHERE equipamento_id = $1",
      [id]
    );

    const especificacoesResult = await db.query(
      "SELECT titulo, destaque FROM especificacoes WHERE equipamento_id = $1",
      [id]
    );

    if (equipamentoResult.rows.length === 0) {
      return res.status(404).json({ error: "Equipamento não encontrado" });
    }

    const equipamento = equipamentoResult.rows[0];
    equipamento.imagens = imagensResult.rows.map((img) => img.url);
    equipamento.especificacoes = especificacoesResult.rows;

    res.json(equipamento);
  } catch (err) {
    console.error("Erro ao buscar equipamento:", err);
    res.status(500).json({ error: "Erro interno ao buscar equipamento" });
  }
};

module.exports = {
  getEquipamentos,
  getEquipamentoById,
};
