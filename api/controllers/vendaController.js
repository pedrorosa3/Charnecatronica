const db = require("../db");

const criarVenda = async (req, res) => {
  const { tipo, custoTransporte, lojaNipc, empregadoId, clienteId, carrinho } = req.body;

  console.log("🛒 [VENDA] Dados recebidos no corpo da requisição:");
  console.log("tipo:", tipo);
  console.log("custoTransporte:", custoTransporte);
  console.log("lojaNipc:", lojaNipc);
  console.log("empregadoId:", empregadoId);
  console.log("clienteId:", clienteId);
  console.log("carrinho:", carrinho);

  if (!clienteId || !tipo || !carrinho || carrinho.length === 0) {
    console.warn("⚠️ [VENDA] Dados obrigatórios em falta.");
    return res.status(400).json({
      success: false,
      message: "ClienteId, tipo de pagamento e carrinho são obrigatórios.",
    });
  }

  try {
    const pessoaCheck = await db.query("SELECT * FROM pessoa WHERE id = $1", [clienteId]);
    if (pessoaCheck.rows.length === 0) {
      console.warn("⚠️ [VENDA] Cliente com ID fornecido não encontrado:", clienteId);
      return res.status(400).json({
        success: false,
        message: "O cliente (pessoa) com o ID fornecido não existe.",
      });
    }

    const insertVenda = await db.query(
      `INSERT INTO venda (tipo, custoTransporte, lojaNipc, empregadoId, clienteId, data) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING numeroVenda`,
      [tipo, custoTransporte, lojaNipc, empregadoId, clienteId]
    );

    const vendaId = insertVenda.rows[0].numerovenda;
    console.log("✅ [VENDA] Venda inserida com ID:", vendaId);

    const insertItens = carrinho.map(async (produto, index) => {
      console.log(`📦 [ITEM ${index}] Inserindo produto:`, produto);
      await db.query(
        `INSERT INTO venda_equipamento (numeroVenda, equipamentoId, quantidade, precoUnitario) 
         VALUES ($1, $2, $3, $4)`,
        [vendaId, produto.id, produto.quantidade, produto.preco]
      );
    });

    await Promise.all(insertItens);

    console.log("✅ [VENDA] Todos os itens do carrinho foram inseridos com sucesso.");

    return res.status(201).json({
      success: true,
      message: "Venda inserida com sucesso.",
      vendaId: vendaId,
    });
  } catch (error) {
    console.error("❌ [VENDA] Erro ao inserir venda:", error);
    res.status(500).json({ success: false, message: "Erro ao inserir venda." });
  }
};

module.exports = {
  criarVenda,
};

