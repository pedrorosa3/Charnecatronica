const db = require("../db");

const upsertPerfil = async (req, res) => {
  const { nome, email, nif, nic, genero, telemovel, dataNascimento } = req.body;

  if (
    !nome ||
    !email ||
    !nif ||
    !nic ||
    !genero ||
    !telemovel ||
    !dataNascimento
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  console.log("Dados recebidos:", req.body);

  try {
    // Faz SELECT para verificar se o utilizador já existe
    console.log("boas");
    const existingUser = await db.query(
      "SELECT id FROM pessoa WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      // UPDATE se já existir
      const updateResult = await db.query(
        `UPDATE pessoa 
         SET nome = $1, nif = $2, nic = $3, genero = $4, telemovel = $5, datadenascimento = $6 
         WHERE LOWER(email) = LOWER($7)
         RETURNING *`,
        [nome, nif, nic, genero, telemovel, dataNascimento, email]
      );

      console.log("Perfil atualizado com sucesso:", updateResult.rows[0]);
      return res.status(200).json({
        message: "Perfil atualizado com sucesso!",
        usuario: updateResult.rows[0],
      });
    } else {
      // INSERT se não existir
      const insertResult = await db.query(
        `INSERT INTO pessoa (nome, email, nif, nic, genero, telemovel, datadenascimento, password, moradaid)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          nome,
          email,
          nif,
          nic,
          genero,
          telemovel,
          dataNascimento,
          "default",
          null,
        ]
      );

      console.log("Novo perfil criado:", insertResult.rows[0]);
      return res.status(201).json({
        message: "Perfil criado com sucesso!",
        usuario: insertResult.rows[0],
      });
    }
  } catch (err) {
    console.error("Erro ao guardar perfil:", err);
    return res.status(500).json({ error: "Erro no servidor ao guardar perfil" });
  }
};

const getPerfilByEmail = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "O email é obrigatório na query string." });
  }

  try {
    const result = await db.query(
      `SELECT nome, email, nif, nic, genero, telemovel, 
              TO_CHAR(datadenascimento, 'YYYY-MM-DD') as datanascimento
       FROM pessoa 
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Perfil não encontrado." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    return res.status(500).json({ error: "Erro no servidor ao buscar perfil." });
  }
};



const getClientIdByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório" });
  }

  try {
    const query = `
      SELECT c.id AS clienteId
      FROM cliente c
      JOIN pessoa p ON c.pessoaId = p.id
      WHERE p.email = $1
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado para este email" });
    }

    return res.json({ clienteId: result.rows[0].clienteid });
  } catch (error) {
    console.error("Erro ao buscar cliente por email:", error);
    return res.status(500).json({ error: "Erro ao buscar cliente" });
  }
};

const findOrCreateUserByEmail = async (req, res) => {
  const { email, nome = "Utilizador" } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório" });
  }

  try {
    // Verifica se já existe
    const existingUser = await db.query(
      "SELECT * FROM pessoa WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("Usuário já existente:", existingUser.rows[0]);
      return res.status(200).json({
        message: "Usuário já existente",
        created: false,
        usuario: existingUser.rows[0],
      });
    }

    // Cria novo com valores padrão
    const result = await db.query(
      `INSERT INTO pessoa 
        (nome, email, nif, nic, genero, telemovel, datadenascimento, password, moradaid)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        nome,
        email,
        "000000000",         // nif padrão
        "00000000",          // nic padrão
        "Outro",             // género padrão
        "910000000",         // telemóvel padrão
        "2000-01-01",        // data nascimento padrão
        "default",           // password padrão
        null                 // moradaid
      ]
    );

    console.log("Novo utilizador criado:", result.rows[0]);
    return res.status(201).json({
      message: "Novo utilizador criado com sucesso",
      created: true,
      usuario: result.rows[0],
    });

  } catch (err) {
    console.error("Erro ao criar/buscar utilizador:", err.message);
    return res.status(500).json({ error: "Erro no servidor ao criar/buscar utilizador" });
  }
};




module.exports = {upsertPerfil, getPerfilByEmail, getClientIdByEmail, findOrCreateUserByEmail };

