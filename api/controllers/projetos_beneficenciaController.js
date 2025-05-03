const db = require("../db");

const getProjetosBeneficencia = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        pb.id, 
        pb.nome, 
        pb.descricao, 
        pb.datalimite, 
        pb.quantidadeequipamentos, 
        pb.organizadorid, 
        pb.lojanipc, 
        pb.fichaequipamentocodbarras, 
        pb.imagem,
        p.nome AS nomeorganizador,
        l.nome AS nomeloja
      FROM projetobeneficencia pb
      LEFT JOIN organizador o ON pb.organizadorid = o.id
      LEFT JOIN pessoa p ON o.pessoaid = p.id
      LEFT JOIN loja l ON pb.lojanipc = l.nipc
      ORDER BY pb.datalimite DESC;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
};

module.exports = { getProjetosBeneficencia };
