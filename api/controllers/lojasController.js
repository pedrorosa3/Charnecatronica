const db = require("../db");

// 🔁 Gerar NIPC único
const gerarNIPCAleatorioUnico = async () => {
  let tentativas = 0;
  let nipc;
  let existe;

  do {
    tentativas++;
    nipc = Math.floor(100000000 + Math.random() * 900000000);
    const resultado = await db.query("SELECT 1 FROM loja WHERE nipc = $1", [
      nipc,
    ]);
    existe = resultado.rowCount > 0;
    if (tentativas > 10) {
      throw new Error("Demasiadas tentativas para gerar NIPC único");
    }
  } while (existe);

  return nipc;
};

// ✅ Criar loja com morada
const insertLojaComMorada = async (req, res) => {
  console.log("➡️ POST /lojas:", req.body);

  try {
    const {
      nome,
      numerotelefone,
      email,
      horarioabertura: horaabertura,
      horariofecho: horafecho,
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

    if (
      !nome ||
      !numerotelefone ||
      !email ||
      !rua ||
      !pais ||
      !horaabertura ||
      !horafecho
    ) {
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }

    let numeroInt = numero !== "" ? parseInt(numero, 10) : null;
    if (numero !== "" && isNaN(numeroInt)) {
      return res.status(400).json({ error: "Número da porta inválido." });
    }

    const moradaResult = await db.query(
      `INSERT INTO morada (pais, localidade, latitude, longitude, freguesia, rua, codigopostal, concelho, numero, distrito)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        pais,
        localidade,
        latitude,
        longitude,
        freguesia,
        rua,
        codigopostal,
        concelho,
        numeroInt,
        distrito,
      ]
    );

    const moradaId = moradaResult.rows[0].id;
    const nipcGerado = await gerarNIPCAleatorioUnico();
    const horaAberturaFormatada = horaabertura.slice(0, 5);
    const horaFechoFormatada = horafecho.slice(0, 5);

    const lojaResult = await db.query(
      `INSERT INTO loja (nipc, nome, numerotelefone, email, moradaid, horaabertura, horafecho)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        nipcGerado,
        nome,
        numerotelefone,
        email,
        moradaId,
        horaAberturaFormatada,
        horaFechoFormatada,
      ]
    );

    res
      .status(201)
      .json({ message: "Loja criada com sucesso!", loja: lojaResult.rows[0] });
  } catch (error) {
    console.error("❌ Erro ao criar loja:", error);
    res.status(500).json({ error: "Erro interno ao criar loja" });
  }
};

// ✅ Obter todas as lojas (com NIPC!)
const getLojas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        l.nipc,
        l.nome,
        l.numerotelefone AS telefone,
        l.email,
        TO_CHAR(l.horaabertura, 'HH24:MI') AS horaabertura,
        TO_CHAR(l.horafecho, 'HH24:MI') AS horafecho,
        m.rua,
        m.numero,
        m.localidade,
        m.latitude,
        m.longitude
      FROM loja l
      JOIN morada m ON l.moradaid = m.id
      ORDER BY l.nome;
    `);

    const lojas = result.rows.map((row) => ({
      nipc: row.nipc,
      nome: row.nome,
      telefone: row.telefone,
      email: row.email,
      horario: `${row.horaabertura} - ${row.horafecho}`,
      morada: `${row.rua}, ${row.numero}, ${row.localidade}`,
      posicao: {
        lat: row.latitude,
        lng: row.longitude,
      },
    }));

    res.status(200).json(lojas);
  } catch (error) {
    console.error("❌ Erro ao buscar lojas:", error);
    res.status(500).json({ error: "Erro ao buscar lojas" });
  }
};

// ✅ Obter empregados por loja
const getEmpregadosByLoja = async (req, res) => {
  const { nipc } = req.params;

  try {
    const result = await db.query(
      `SELECT e.numinterno AS id, p.nome AS nome
       FROM empregado e
       JOIN pessoa p ON e.pessoaid = p.id
       WHERE e.lojanipc = $1
       ORDER BY p.nome;`,
      [nipc]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar empregados da loja:", error);
    res.status(500).json({ error: "Erro ao buscar empregados da loja" });
  }
};

module.exports = {
  insertLojaComMorada,
  getLojas,
  getEmpregadosByLoja,
};
