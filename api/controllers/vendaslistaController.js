const db = require("../db");

// Função para listar todas as vendas
const listarVendas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.numerovenda, 
        v.data, 
        v.tipo, 
        c.nome AS clientenome,
        v.custotransporte
      FROM venda v
      JOIN cliente cl ON v.clienteid = cl.id
      JOIN pessoa c ON cl.pessoaid = c.id
      ORDER BY v.data DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ error: "Erro ao buscar vendas" });
  }
};

// Função para obter detalhes de uma venda específica
const detalhesVenda = async (req, res) => {
  const { numerovenda } = req.params;

  try {
    // Consulta da venda + info cliente
    const vendaResult = await db.query(`
      SELECT 
        v.numerovenda, 
        v.data AS datavenda, 
        v.tipo, 
        pc.nome AS clientenome,
        pc.email AS clienteemail,
        pc.telemovel AS clientetelemovel,
        v.custotransporte
      FROM venda v
      JOIN cliente cl ON v.clienteid = cl.id
      JOIN pessoa pc ON cl.pessoaid = pc.id
      WHERE v.numerovenda = $1
    `, [numerovenda]);

    if (vendaResult.rows.length === 0) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    const venda = vendaResult.rows[0];

    // Equipamentos vendidos com imagem
    const equipamentosResult = await db.query(`
      SELECT 
        ve.id, 
        fe.marca, 
        fe.modelo, 
        ve.precounitario, 
        ve.quantidade,
        (
          SELECT url 
          FROM imagensequipamento 
          WHERE codbarras = fe.codbarras 
          LIMIT 1
        ) AS imagemurl
      FROM venda_equipamento ve
      JOIN equipamentos e ON ve.equipamentoid = e.id
      JOIN fichadeequipamento fe ON e.codbarras = fe.codbarras
      WHERE ve.numerovenda = $1
    `, [numerovenda]);

    // Resposta formatada
    res.status(200).json({
      numerovenda: venda.numerovenda,
      datavenda: venda.datavenda,
      tipo: venda.tipo,
      clientenome: venda.clientenome,
      clienteemail: venda.clienteemail,
      clientetelemovel: venda.clientetelemovel,
      custotransporte: venda.custotransporte,
      equipamentos: equipamentosResult.rows
    });
  } catch (err) {
    console.error("Erro ao buscar detalhes da venda:", err);
    res.status(500).json({ error: "Erro ao buscar detalhes da venda" });
  }
};

module.exports = { listarVendas, detalhesVenda };
















