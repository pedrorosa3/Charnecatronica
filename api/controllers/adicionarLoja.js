const db = require("../db");

const insertLojaComMorada = async (req, res) => {
  try {
    const {
      nome,
      numerotelefone,
      email,
      morada: {
        pais,
        localidade,
        latitude,
        longitude,
        freguesia,
        rua,
        codigopostal,
        concelho,
        numero,
        distrito,
      },
    } = req.body;

    if (!nome || !numerotelefone || !email || !rua || !pais) {
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }

    const moradaResult = await db.query(
      `INSERT INTO morada (pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numero, distrito)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numero, distrito]
    );

    const moradaId = moradaResult.rows[0].id;
    console.log(moradaID);

    const lojaResult = await db.query(
      `INSERT INTO loja (nome, numerotelefone, email, moradaid)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, numerotelefone, email, moradaId]
    );

    res.status(201).json({ message: "Loja criada com sucesso!", loja: lojaResult.rows[0] });
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    res.status(500).json({ error: "Erro interno ao criar loja" });
  }
};

module.exports = { insertLojaComMorada };
