const db = require("../db");

const getCompraLista = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        compra.id, 
        compra.data, 
        compra.preco, 
        cliente.id AS clienteId, 
        pessoaCliente.nome AS clienteNome,
        empregado.numInterno AS empregadoId, 
        pessoaEmpregado.nome AS empregadoNome,
        loja.nome AS lojaNome, 
        loja.nipc AS lojaNipc,
        fichaDeEquipamento.codBarras AS equipamentoCodBarras, 
        fichaDeEquipamento.marca AS equipamentoMarca,
        fichaDeEquipamento.modelo AS equipamentoModelo
      FROM compra
      JOIN cliente ON compra.clienteId = cliente.id
      JOIN pessoa AS pessoaCliente ON cliente.pessoaId = pessoaCliente.id
      JOIN empregado ON compra.empregadoId = empregado.numInterno
      JOIN pessoa AS pessoaEmpregado ON empregado.pessoaId = pessoaEmpregado.id
      JOIN loja ON compra.lojaNipc = loja.nipc
      JOIN fichaDeEquipamento ON compra.codBarras = fichaDeEquipamento.codBarras
      ORDER BY compra.data DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ error: "Erro ao buscar compras" });
  }
};

const getCompraById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        compra.id, 
        compra.data, 
        compra.preco,
        compra.estado,
        compra.metodoPagamento,

        -- Cliente
        cliente.id AS clienteId, 
        pessoaCliente.nome AS clienteNome,
        pessoaCliente.email AS clienteEmail,
        pessoaCliente.telemovel AS clienteTelemovel,

        -- Empregado
        empregado.numInterno AS empregadoId, 
        pessoaEmpregado.nome AS empregadoNome,
        pessoaEmpregado.email AS empregadoEmail,
        pessoaEmpregado.telemovel AS empregadoTelemovel,

        -- Loja
        loja.nome AS lojaNome, 
        loja.nipc AS lojaNipc,
        loja.numeroTelefone AS lojaTelefone,

        -- Morada da Loja
        morada.rua AS lojaRua,
        morada.numero AS lojaNumero,
        morada.localidade AS lojaLocalidade,
        morada.concelho AS lojaConcelho,
        morada.distrito AS lojaDistrito,
        morada.codigoPostal AS lojaCodigoPostal,

        -- Equipamento
        fichaDeEquipamento.codBarras AS equipamentoCodBarras, 
        fichaDeEquipamento.marca AS equipamentoMarca,
        fichaDeEquipamento.modelo AS equipamentoModelo,
        fichaDeEquipamento.tipo AS equipamentoTipo,
        fichaDeEquipamento.anoLancamento AS equipamentoAnoLancamento,

        -- Imagem do Equipamento
        (
          SELECT url 
          FROM imagensEquipamento 
          WHERE codBarras = fichaDeEquipamento.codBarras 
          LIMIT 1
        ) AS equipamentoImagemUrl

      FROM compra
      JOIN cliente ON compra.clienteId = cliente.id
      JOIN pessoa AS pessoaCliente ON cliente.pessoaId = pessoaCliente.id
      JOIN empregado ON compra.empregadoId = empregado.numInterno
      JOIN pessoa AS pessoaEmpregado ON empregado.pessoaId = pessoaEmpregado.id
      JOIN loja ON compra.lojaNipc = loja.nipc
      JOIN morada ON loja.moradaId = morada.id
      JOIN fichaDeEquipamento ON compra.codBarras = fichaDeEquipamento.codBarras
      WHERE compra.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Compra não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar compra por ID:", err);
    res.status(500).json({ error: "Erro ao buscar compra por ID" });
  }
};

module.exports = { getCompraLista, getCompraById };
