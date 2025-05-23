const db = require("../db");

// Função para listar todas as vendas
const listarVendas = async (req, res) => {
  try {
    const vendasResult = await db.query(`
      SELECT 
        v.numerovenda, 
        v.data, 
        v.tipo, 
        v.estadovenda,
        c.nome AS clientenome,
        v.custotransporte
      FROM venda v
      JOIN cliente cl ON v.clienteid = cl.id
      JOIN pessoa c ON cl.pessoaid = c.id
      ORDER BY v.data DESC
    `);

    const vendas = vendasResult.rows;

    const equipamentosResult = await db.query(`
      SELECT 
        ve.numerovenda,
        ve.id, 
        fe.marca, 
        fe.modelo, 
        ve.precounitario, 
        ve.quantidade
      FROM venda_equipamento ve
      JOIN equipamentos e ON ve.equipamentoid = e.id
      JOIN fichadeequipamento fe ON e.codbarras = fe.codbarras
    `);

    const equipamentosPorVenda = {};
    for (const eq of equipamentosResult.rows) {
      if (!equipamentosPorVenda[eq.numerovenda]) {
        equipamentosPorVenda[eq.numerovenda] = [];
      }
      equipamentosPorVenda[eq.numerovenda].push({
        id: eq.id,
        marca: eq.marca,
        modelo: eq.modelo,
        precounitario: eq.precounitario,
        quantidade: eq.quantidade,
      });
    }

    const vendasComEquipamentos = vendas.map((venda) => ({
      ...venda,
      equipamentos: equipamentosPorVenda[venda.numerovenda] || [],
    }));

    res.status(200).json(vendasComEquipamentos);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ error: "Erro ao buscar vendas" });
  }
};


// Função para obter detalhes de uma venda específica
const detalhesVenda = async (req, res) => {
  const { numerovenda } = req.params;

  try {
    const vendaResult = await db.query(`
      SELECT 
        v.numerovenda, 
        v.data AS datavenda, 
        v.tipo, 
        v.estadovenda,
        pc.nome AS clientenome,
        pc.email AS clienteemail,
        pc.telemovel AS clientetelemovel,
        v.custotransporte,
        m.rua AS clienterua,
        m.localidade AS clientelocalidade
      FROM venda v
      JOIN cliente cl ON v.clienteid = cl.id
      JOIN pessoa pc ON cl.pessoaid = pc.id
      JOIN morada m ON pc.moradaid = m.id
      WHERE v.numerovenda = $1
    `, [numerovenda]);

    if (vendaResult.rows.length === 0) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    const venda = vendaResult.rows[0];

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

    res.status(200).json({
      numerovenda: venda.numerovenda,
      datavenda: venda.datavenda,
      tipo: venda.tipo,
      estadovenda: venda.estadovenda,
      clientenome: venda.clientenome,
      clienteemail: venda.clienteemail,
      clientetelemovel: venda.clientetelemovel,
      clienterua: venda.clienterua,
      clientelocalidade: venda.clientelocalidade,
      custotransporte: venda.custotransporte,
      equipamentos: equipamentosResult.rows
    });
  } catch (err) {
    console.error("Erro ao buscar detalhes da venda:", err);
    res.status(500).json({ error: "Erro ao buscar detalhes da venda" });
  }
};


const atualizarEstadoVenda = async (req, res) => {
  const { numerovenda } = req.params;
  const { estadovenda } = req.body;

  if (!estadovenda) {
    return res.status(400).json({ error: "O parâmetro 'estadovenda' é obrigatório." });
  }

  try {
    await db.query(
      "UPDATE venda SET estadovenda = $1 WHERE numerovenda = $2",
      [estadovenda, numerovenda]
    );
    res.status(200).json({ message: "Estado da venda atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar estado da venda:", err);
    res.status(500).json({ error: "Erro ao atualizar estado da venda." });
  }
};

module.exports = {
  listarVendas,
  detalhesVenda,
  atualizarEstadoVenda
};

















