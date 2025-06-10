const db = require("../db");

const getInteressesById = async (req, res) => {
  const { email } = req.query; // ou req.user.id se usares autenticação
  

  if (!email) return res.status(400).json({ error: "Email não fornecido" });

  try {
    // 1. Vai buscar o id da pessoa pelo email
    const pessoaResult = await db.query(
      `SELECT id FROM pessoa WHERE email = $1`,
      [email]
    );

    if (pessoaResult.rows.length === 0) {
      return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    const pessoaId = pessoaResult.rows[0].id;

    // 2. Vai buscar o cliente.id a partir da pessoa.id
    const clienteResult = await db.query(
      `SELECT id FROM cliente WHERE pessoaid = $1`,
      [pessoaId]
    );

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado para esta pessoa" });
    }

    const clienteId = clienteResult.rows[0].id;

    // 3. Vai buscar os interesses com esse clienteId
    const interessesResult = await db.query(
      `
      SELECT 
        i.id,
        i.data,
        i.lojanipc,
        i.fichaequipamentocodbarras AS codbarras,
        f.marca,
        f.modelo,
        f.tipo,
        f.precobase,
        f.anolancamento
      FROM interesse i
      JOIN fichaDeEquipamento f ON i.fichaequipamentocodbarras = f.codBarras
      WHERE i.clienteid = $1
      ORDER BY i.data DESC
      `,
      [clienteId]
    );
    
    res.status(200).json(interessesResult.rows);
  } catch (error) {
    console.error("Erro ao buscar interesses:", error);
    res.status(500).json({ error: "Erro ao buscar interesses" });
  }
};

module.exports = {
  getInteressesById,
};
