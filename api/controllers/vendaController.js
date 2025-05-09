const db = require("../db");

const criarVenda = async (req, res) => {
    const { tipo, custoTransporte, lojaNipc, empregadoId, clienteId, carrinho } = req.body;

  if (!clienteId || !tipo || !carrinho || carrinho.length === 0) {
    return res.status(400).json({
      success: false,
      message: "ClienteId, tipo de pagamento e carrinho são obrigatórios.",
    });
  }

  try {
    // Verifique se o cliente (pessoa) existe na tabela 'pessoa'
    const pessoaCheck = await db.query("SELECT * FROM pessoa WHERE id = $1", [clienteId]);
    if (pessoaCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "O cliente (pessoa) com o ID fornecido não existe.",
      });
    }

    // Inserir venda na tabela 'venda'
    const insertVenda = await db.query(
      `INSERT INTO venda (tipo, custoTransporte, lojaNipc, empregadoId, clienteId) 
       VALUES ($1, $2, $3, $4, $5) RETURNING numeroVenda`,
      [tipo, custoTransporte, lojaNipc, empregadoId, clienteId]
    );

    const vendaId = insertVenda.rows[0].numerovenda; // ID da venda inserida

    // Inserir os produtos do carrinho na tabela 'venda_equipamento'
    const insertItens = carrinho.map(async (produto) => {
      await db.query(
        `INSERT INTO venda_equipamento (numeroVenda, equipamentoId, quantidade, precoUnitario) 
         VALUES ($1, $2, $3, $4)`,
        [vendaId, produto.id, produto.quantidade, produto.preco]
      );
    });

    await Promise.all(insertItens); // Aguarda todos os inserts dos itens do carrinho

    return res.status(201).json({
      success: true,
      message: "Venda inserida com sucesso.",
      vendaId: vendaId,
    });
  } catch (error) {
    console.error("Erro ao inserir venda:", error);
    res.status(500).json({ success: false, message: "Erro ao inserir venda." });
  }
};

module.exports = {
  criarVenda,
};

