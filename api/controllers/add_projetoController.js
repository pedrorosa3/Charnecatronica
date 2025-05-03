const db = require("../db"); // Conexão com o PostgreSQL

const insertProjeto = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      datalimite,
      quantidadeequipamentos,
      nomeorganizador,
      nomeloja,
      imagem,
      fichaequipamentocodbarras,
    } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (
      !nome ||
      !descricao ||
      !datalimite ||
      !quantidadeequipamentos ||
      !nomeorganizador ||
      !nomeloja ||
      !fichaequipamentocodbarras
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Buscar o id do organizador baseado no nome da pessoa (tabela pessoa)
    const organizadorResult = await db.query(
      `SELECT p.id FROM pessoa p 
       JOIN organizador o ON p.id = o.pessoaId 
       WHERE p.nome = $1`,
      [nomeorganizador]
    );

    if (organizadorResult.rows.length === 0) {
      return res.status(400).json({ error: "Organizador não encontrado" });
    }
    const organizadorId = organizadorResult.rows[0].id;

    // Buscar o id da loja baseado no nome
    const lojaResult = await db.query(`SELECT nipc FROM loja WHERE nome = $1`, [
      nomeloja,
    ]);

    if (lojaResult.rows.length === 0) {
      return res.status(400).json({ error: "Loja não encontrada" });
    }
    const lojaNipc = lojaResult.rows[0].nipc;

    // Inserir o novo projeto na tabela projetoBeneficencia
    const result = await db.query(
      `INSERT INTO projetoBeneficencia (nome, descricao, dataLimite, quantidadeEquipamentos, organizadorId, lojaNipc, fichaEquipamentoCodBarras, imagem)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        nome,
        descricao,
        datalimite,
        quantidadeequipamentos,
        organizadorId,
        lojaNipc,
        fichaequipamentocodbarras,
        imagem,
      ]
    );

    res.status(201).json({
      message: "Projeto registrado com sucesso!",
      projeto: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao registrar projeto:", err);
    res.status(500).json({ error: "Erro ao registrar projeto" });
  }
};

module.exports = { insertProjeto };
