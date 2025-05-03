const db = require("../db");

// Criar ou atualizar perfil de usuário
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
    const existingUser = await db.query(
      "SELECT * FROM pessoa WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      await db.query(
        `UPDATE pessoa 
         SET nome = $1, nif = $2, nic = $3, genero = $4, telemovel = $5, datadenascimento = $6 
         WHERE email = $7`,
        [nome, nif, nic, genero, telemovel, dataNascimento, email]
      );

      console.log("Perfil atualizado com sucesso.");
      return res
        .status(200)
        .json({ message: "Perfil atualizado com sucesso!" });
    } else {
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
    return res
      .status(500)
      .json({ error: "Erro no servidor ao guardar perfil" });
  }
};

module.exports = {
  upsertPerfil,
};
