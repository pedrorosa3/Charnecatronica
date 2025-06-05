const db = require("../db");

const criarVendaFisica = async (req, res) => {
  const {
    preco,
    clienteId,
    empregadoId,
    lojaNipc,
    Cod_barras,
    marca,
    modelo,
    metodoPagamento,
  } = req.body;

  console.log("🛒 Dados recebidos em criarVendaFisica:", req.body);

  // Validação básica
  if (!clienteId || !metodoPagamento || !modelo || !lojaNipc || !empregadoId) {
    return res.status(400).json({
      success: false,
      message: "Campos obrigatórios em falta.",
    });
  }

  try {
    // Verificar se cliente existe
    const cliente = await db.query("SELECT * FROM cliente WHERE id = $1", [clienteId]);
    if (cliente.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cliente não encontrado.",
      });
    }

    const equipamento = await db.query(
      `SELECT * FROM equipamentos 
      WHERE codBarras = $1`,
      [Cod_barras]
    );


    if (equipamento.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Equipamento não encontrado.",
      });
    }

    const equipamentoData = equipamento.rows[0];

    if (equipamentoData.estadovenda === "Vendido") {
      return res.status(400).json({
        success: false,
        message: "Equipamento já está vendido.",
      });
    }

    // Inserir venda
    const insertVenda = await db.query(
      `INSERT INTO venda (tipo, custoTransporte, lojaNipc, empregadoId, clienteId, data, estadoVenda)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, 'Pago') RETURNING numeroVenda`,
      [metodoPagamento, 0, lojaNipc, empregadoId, clienteId]
    );


    const vendaId = insertVenda.rows[0].numerovenda;


    // Inserir item único
    await db.query(
      `INSERT INTO venda_equipamento (numeroVenda, equipamentoId, quantidade, precoUnitario)
       VALUES ($1, $2, $3, $4)`,
      [vendaId, equipamentoData.id, 1, preco]
    );

    // Atualizar estado para "Vendido"
    await db.query(
      `UPDATE equipamentos SET estadovenda = 'Vendido' WHERE id = $1`,
      [equipamentoData.id]
    );

    return res.status(201).json({
      success: true,
      message: "Venda física realizada com sucesso.",
      vendaId,
    });
  } catch (error) {
    console.error("Erro em criarVendaFisica:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao criar venda física.",
    });
  }
};

module.exports = {
  criarVendaFisica,
};
