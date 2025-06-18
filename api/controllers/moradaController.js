const db = require("../db"); // Configuração do banco de dados

const adicionarMorada = async (req, res) => {
  const {
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
  } = req.body;

  // Verifique os campos obrigatórios mínimos
  if (!rua || !numero || !codigopostal || !localidade) {
    return res.status(400).json({
      success: false,
      message: "Os campos rua, número, código postal e localidade são obrigatórios.",
    });
  }

  try {
    const query = `
      INSERT INTO morada (
        pais, localidade, latitude, longitude, freguesia,
        rua, codigopostal, concelho, numero, distrito
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;

    // Se pais não vier, define "Portugal" como default
    const paisValue = pais || "Portugal";

    const values = [
      paisValue,
      localidade || null,
      latitude || null,
      longitude || null,
      freguesia || null,
      rua,
      codigopostal,
      concelho || null,
      numero,
      distrito || null,
    ];

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(201).json({
        success: true,
        message: "Morada inserida com sucesso",
        id: result.rows[0].id,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Erro ao inserir a morada",
      });
    }
  } catch (error) {
    console.error("Erro ao inserir morada:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

module.exports = {
  adicionarMorada,
};



