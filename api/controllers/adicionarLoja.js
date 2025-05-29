const db = require("../db");

// Função para gerar NIPC aleatório e único
const gerarNIPCAleatorioUnico = async () => {
  let tentativas = 0;
  let nipc;
  let existe;

  do {
    tentativas++;
    // Gera número aleatório de 9 dígitos
    nipc = Math.floor(100000000 + Math.random() * 900000000);

    const resultado = await db.query("SELECT 1 FROM loja WHERE nipc = $1", [nipc]);
    existe = resultado.rowCount > 0;

    if (tentativas > 10) {
      throw new Error("Demasiadas tentativas para gerar NIPC único");
    }
  } while (existe);

  return nipc;
};

// Função para inserir loja com morada
const insertLojaComMorada = async (req, res) => {
  console.log("➡️ Recebido POST /lojas");
  console.log("📦 Dados recebidos:", req.body);

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
    if (numero !== "") {
      numeroInt = parseInt(numero, 10);
      if (isNaN(numeroInt)) {
        console.warn("⚠️ Número da porta inválido.");
        return res.status(400).json({ error: "Número da porta inválido." });
      }
    }

    const moradaResult = await db.query(
      `INSERT INTO morada (pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numero, distrito)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numeroInt, distrito]
    );

    const moradaId = moradaResult.rows[0].id;
    console.log("✅ Morada inserida com ID:", moradaId);

    const nipcGerado = await gerarNIPCAleatorioUnico();
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

// NOVO: Buscar todas as lojas
const getLojas = async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT loja.nome, loja.numerotelefone AS telefone, loja.email, 
              morada.latitude, morada.longitude,
              morada.rua, morada.numero, morada.localidade
       FROM loja
       JOIN morada ON loja.moradaid = morada.id`
    );

    const lojas = resultado.rows.map((row) => ({
      nome: row.nome,
      telefone: row.telefone,
      email: row.email,
      horario: "A definir",
      morada: `${row.rua}, ${row.numero}, ${row.localidade}`,
      posicao: {
        lat: row.latitude,
        lng: row.longitude,
      },
    }));

    res.json(lojas);
  } catch (error) {
    console.error("❌ Erro ao buscar lojas:", error);
    res.status(500).json({ error: "Erro ao buscar lojas" });
  }
};

module.exports = {
  insertLojaComMorada,
  getLojas, // NOVO
};
