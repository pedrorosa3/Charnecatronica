// controllers/projetoController.js
const db = require("../db");

const getProjetosBeneficencia = async (req, res) => {
  try {
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
    res.status(200).json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
};

const deleteProjetoBeneficencia = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await db.query(
      "DELETE FROM projetoBeneficencia WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.status(200).json({ message: "Projeto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);
    res.status(500).json({ error: "Erro ao excluir projeto" });
  }
};

module.exports = { getProjetosBeneficencia, deleteProjetoBeneficencia };
