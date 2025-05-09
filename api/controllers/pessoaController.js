const db = require("../db");

const adicionarPessoa = async (req, res) => {
  const { nif, nome, telefone, email, moradaId } = req.body;

  if (!nif || !nome || !telefone || !email || !moradaId) {
    return res.status(400).json({
      success: false,
      message: "Todos os campos são obrigatórios (incluindo moradaId).",
    });
  }

  try {
    // Inicia a transação
    await db.query('BEGIN');
    
    // Verificar se já existe uma pessoa com o mesmo email ou nif
    const check = await db.query(
      "SELECT * FROM pessoa WHERE email = $1 OR nif = $2",
      [email, nif]
    );

    let pessoaId;
    let clienteId;

    if (check.rows.length > 0) {
      // Atualizar a pessoa existente
      await db.query(
        `UPDATE pessoa 
         SET nome = $1, telemovel = $2, email = $3, moradaId = $4 
         WHERE email = $5 OR nif = $6`,
        [nome, telefone, email, moradaId, email, nif]
      );

      // Recuperar o id da pessoa atualizada
      const updatedPessoa = await db.query(
        "SELECT id FROM pessoa WHERE email = $1 OR nif = $2",
        [email, nif]
      );
      pessoaId = updatedPessoa.rows[0].id;

    } else {
      // Inserir uma nova pessoa
      const insertPessoa = await db.query(
        `INSERT INTO pessoa (nif, nome, email, telemovel, moradaId) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [nif, nome, email, telefone, moradaId]
      );
      pessoaId = insertPessoa.rows[0].id;
    }

    // Inserir na tabela cliente associando a pessoa
    const insertCliente = await db.query(
      `INSERT INTO cliente (pessoaId) 
       VALUES ($1) RETURNING id`,
      [pessoaId]
    );
    clienteId = insertCliente.rows[0].id;

    // Commit da transação
    await db.query('COMMIT');

    // Retornar a resposta com o id da pessoa e cliente
    return res.status(201).json({
      success: true,
      message: "Pessoa e cliente inseridos com sucesso.",
      pessoaId: pessoaId,
      clienteId: clienteId,
    });

  } catch (error) {
    // Se ocorrer algum erro, faz o rollback da transação
    await db.query('ROLLBACK');
    
    console.error(error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
};

module.exports = {
  adicionarPessoa,
};






