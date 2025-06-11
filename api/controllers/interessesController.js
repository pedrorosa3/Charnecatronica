const db = require("../db");


const deleteInteresse = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM interesse WHERE id = $1", [id]);
    res.status(200).json({ message: "Interesse removido com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover interesse." });
  }
};

const adicionarInteresse = async (req, res) => {
  const { email, marca, modelo } = req.body;

  if (!email || !marca || !modelo) {
    return res.status(400).json({ error: "Campos obrigatórios em falta." });
  }

  try {
    // 1. Ir buscar pessoa
    const pessoaResult = await db.query(`SELECT id FROM pessoa WHERE email = $1`, [email]);
    if (pessoaResult.rows.length === 0) return res.status(404).json({ error: "Pessoa não encontrada" });

    const pessoaId = pessoaResult.rows[0].id;

    // 2. Ir buscar cliente
    const clienteResult = await db.query(`SELECT id FROM cliente WHERE pessoaid = $1`, [pessoaId]);
    if (clienteResult.rows.length === 0) return res.status(404).json({ error: "Cliente não encontrado" });

    const clienteId = clienteResult.rows[0].id;

    // 3. Ir buscar codBarras correspondente à marca + modelo
    const fichaResult = await db.query(
      `SELECT codbarras FROM fichadeequipamento WHERE marca = $1 AND modelo = $2`,
      [marca, modelo]
    );

    if (fichaResult.rows.length === 0) return res.status(404).json({ error: "Equipamento não encontrado" });

    const codBarras = fichaResult.rows[0].codbarras;

    // 4. Inserir interesse
    const now = new Date();
    await db.query(
      `INSERT INTO interesse (clienteid, fichaequipamentocodbarras, data) VALUES ($1, $2, $3)`,
      [clienteId, codBarras, now]
    );

    res.status(201).json({ message: "Interesse adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar interesse:", error);
    res.status(500).json({ error: "Erro ao adicionar interesse" });
  }
};

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
        f.anolancamento,
        EXISTS (
          SELECT 1
          FROM equipamentos e
          WHERE e.codbarras = i.fichaequipamentocodbarras
            AND e.estadovenda = 'À venda'
          LIMIT 1
        ) AS disponivel
      FROM interesse i
      JOIN fichadeequipamento f ON i.fichaequipamentocodbarras = f.codbarras
      WHERE i.clienteid = $1
      ORDER BY i.data DESC

      `,
      [clienteId]
    );

    const disponiveis = interessesResult.rows.filter((i) => i.disponivel).length;


    res.status(200).json({
      disponiveis,
      interesses: interessesResult.rows,
    });

    
  } catch (error) {
    console.error("Erro ao buscar interesses:", error);
    res.status(500).json({ error: "Erro ao buscar interesses" });
  }
};

module.exports = {
  getInteressesById,
  adicionarInteresse,
  deleteInteresse,
};
