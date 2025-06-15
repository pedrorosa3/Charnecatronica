const db = require("../db");

// Buscar todos os projetos
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
      FROM projetoBeneficencia pb
      LEFT JOIN organizador o ON pb.organizadorid = o.id
      LEFT JOIN pessoa p ON o.pessoaid = p.id
      LEFT JOIN loja l ON pb.lojanipc = l.nipc
      ORDER BY pb.datalimite DESC;
    `);

    res.status(200).json(projetosResult.rows);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
};

// Buscar projeto por ID
const getProjetoById = async (req, res) => {
  const { id } = req.params;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  const idNumerico = Number(id);
  
  console.log("ID recebido na URL:", idNumerico);


  console.log("=== ROTA GET /:id ===");
  console.log("ID recebido na URL:", id, "Tipo:", typeof id, "ID numérico:", idNumerico);

  try {
    const projetoQuery = `
      SELECT pb.*, p.nome AS nomeOrganizador, l.nome AS nomeLoja
      FROM projetoBeneficencia pb
      LEFT JOIN organizador o ON pb.organizadorId = o.id
      LEFT JOIN pessoa p ON o.pessoaId = p.id
      LEFT JOIN loja l ON pb.lojaNipc = l.nipc
      WHERE pb.id = $1
    `;

    const projetoResult = await db.query(projetoQuery, [idNumerico]);

    if (projetoResult.rows.length === 0) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    const projetoBase = projetoResult.rows[0];
    console.log("Projeto base:", projetoBase);

    // Buscar imagens adicionais
    const imagensQuery = `SELECT url FROM imagemProjeto WHERE projetoId = $1`;
    console.log("Executando query de imagens...");
    const imagensResult = await db.query(imagensQuery, [idNumerico]);

    // Obter array de URLs da tabela imagemProjeto
    let imagens = imagensResult.rows.map((row) => row.url);

    // Se a imagem principal existe e não está duplicada, adicioná-la no início
    if (projetoBase.imagem && !imagens.includes(projetoBase.imagem)) {
      imagens.unshift(projetoBase.imagem);
    }

    // Construir objeto final
    const projeto = {
      ...projetoBase,
      imagens,
    };

    console.log("Projeto final enviado:", projeto);
    res.status(200).json(projeto);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

module.exports = { getProjetosBeneficencia, getProjetoById };
