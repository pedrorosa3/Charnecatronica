const db = require("../db");

const getProjetosBeneficencia = async (req, res) => {
  try {
    // Pega projetos básicos + dados organizador e loja
    const projetosResult = await db.query(`
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

    const projetos = projetosResult.rows;
/*
    // Pega imagens para todos os projetos retornados
    const imagensResult = await db.query(`
      SELECT projetoid, urlimagem
      FROM projetoimagens
      WHERE projetoid = ANY($1)
    `, [projetos.map(p => p.id)]);

    const imagens = imagensResult.rows;

    // Adiciona array de imagens em cada projeto
    projetos.forEach(projeto => {
      projeto.imagens = imagens
        .filter(img => img.projetoid === projeto.id)
        .map(img => img.urlimagem);
    });
*/
    res.status(200).json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
};

module.exports = { getProjetosBeneficencia };
