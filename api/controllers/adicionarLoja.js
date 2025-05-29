const db = require("../db");

const gerarNIPCAleatorioUnico = async () => {
  let tentativas = 0;
  let nipc;
  let existe;

  do {
    tentativas++;
    // Gera número aleatório de 9 dígitos
    nipc = Math.floor(100000000 + Math.random() * 900000000); // Garante 9 dígitos

    const resultado = await db.query("SELECT 1 FROM loja WHERE nipc = $1", [nipc]);
    existe = resultado.rowCount > 0;

    if (tentativas > 10) {
      throw new Error("Demasiadas tentativas para gerar NIPC único");
    }
  } while (existe);

  return nipc;
};


const insertLojaComMorada = async (req, res) => {
  console.log("➡️ Recebido POST /lojas");
  console.log("📦 Dados recebidos:", req.body); // 👈 Aqui o log completo dos dados

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
      } = {},
    } = req.body;

    if (!nome || !numerotelefone || !email || !rua || !pais) {
      console.warn("⚠️ Campos obrigatórios em falta.");
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }
    let numeroInt = null;
    if (req.body.morada.numero !== "") {
      numeroInt = parseInt(req.body.morada.numero, 10);
    }


    const moradaResult = await db.query(
      
      `INSERT INTO morada (pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numero, distrito)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numeroInt, distrito]
    );

    const moradaId = moradaResult.rows[0].id;
    console.log("✅ Morada inserida com ID:", moradaId);

    const nipcGerado = await gerarNIPCAleatorioUnico()
    const lojaResult = await db.query(
      `INSERT INTO loja (nipc, nome, numerotelefone, email, moradaid)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nipcGerado, nome, numerotelefone, email, moradaId]
    );

    console.log("✅ Loja criada:", lojaResult.rows[0]);

    res.status(201).json({
      message: "Loja criada com sucesso!",
      loja: lojaResult.rows[0],
    });
  } catch (error) {
    console.error("❌ Erro ao criar loja:", error);
    res.status(500).json({ error: "Erro interno ao criar loja" });
  }
};

module.exports = { insertLojaComMorada };
