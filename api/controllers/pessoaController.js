const db = require("../db"); // Importando a configuração do banco de dados

// Função para adicionar ou atualizar a pessoa no banco de dados
const adicionarPessoa = async (req, res) => {
    const { nif, nome, telefone, email } = req.body;
  
    if (!nif || !nome || !telefone || !email) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
    }
  
    try {
      // Verifica se já existe alguém com esse email OU nif
      const check = await db.query(
        'SELECT * FROM pessoa WHERE email = $1 OR nif = $2',
        [email, nif]
      );
  
      if (check.rows.length > 0) {
        // Atualiza se já existe
        await db.query(
          `UPDATE pessoa SET nome = $1, telemovel = $2, email = $3 WHERE email = $4 OR nif = $5`,
          [nome, telefone, email, email, nif]
        );
        return res.status(200).json({ success: true, message: "Pessoa atualizada com sucesso." });
      } else {
        // Insere novo se não existir
        const insert = await db.query(
          `INSERT INTO pessoa (nif, nome, email, telemovel) VALUES ($1, $2, $3, $4) RETURNING id`,
          [nif, nome, email, telefone]
        );
        return res.status(201).json({ success: true, message: "Pessoa inserida com sucesso", id: insert.rows[0].id });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  };
  

module.exports = {
  adicionarPessoa,
};


