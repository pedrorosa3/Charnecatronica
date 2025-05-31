const pool = require("../db");

// Obter todas as reparações
exports.getAllReparacoes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reparacao");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter uma reparação por ID
exports.getReparacaoById = async (req, res) => {
  const reparacaoId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        r.*, 
        f.marca,
        f.modelo,
        f.tipo,

        -- Imagem principal
        (
          SELECT url 
          FROM imagensEquipamento 
          WHERE codBarras = r.codBarras 
          LIMIT 1
        ) AS imagemurl,

        -- Loja
        l.nome AS lojanome,
        l.email AS lojaemail,
        l.numeroTelefone AS lojatelefone,
        ml.rua AS lojarua,
        ml.numero AS lojanumero,
        ml.localidade AS lojalocalidade,
        ml.concelho AS lojaconcelho,
        ml.distrito AS lojadistrito,
        ml.codigoPostal AS lojacodigopostal,

        -- Cliente
        pc.nome AS clientenome,
        pc.email AS clienteemail,
        pc.telemovel AS clientetelemovel,
        mc.rua AS clienterua,
        mc.numero AS clientenumero,
        mc.localidade AS clientelocalidade,
        mc.concelho AS clienteconcelho,
        mc.distrito AS clientedistrito,
        mc.codigoPostal AS clientecodigopostal,

        -- Empregado
        pe.nome AS empregadonome,
        pe.email AS empregadoemail,
        pe.telemovel AS empregadotelemovel

      FROM reparacao r
      LEFT JOIN fichaDeEquipamento f ON r.codBarras = f.codBarras
      LEFT JOIN loja l ON r.lojaNipc = l.nipc
      LEFT JOIN morada ml ON l.moradaId = ml.id

      LEFT JOIN cliente c ON r.clienteId = c.id
      LEFT JOIN pessoa pc ON c.pessoaId = pc.id
      LEFT JOIN morada mc ON pc.moradaId = mc.id

      LEFT JOIN empregado e ON r.empregadoId = e.numInterno
      LEFT JOIN pessoa pe ON e.pessoaId = pe.id

      WHERE r.id = $1
      `,
      [reparacaoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reparação não encontrada" });
    }

    const reparacao = result.rows[0];

    // Buscar peças associadas ao diagnóstico
    const pecasResult = await pool.query(
      `
      SELECT 
        peca, 
        custo, 
        estadoEquipamento AS estado_diagnostico
      FROM pecasASubstituir
      WHERE reparacaoId = $1
      `,
      [reparacaoId]
    );

    reparacao.pecasSubstituir = pecasResult.rows.map((p) => ({
      nome: p.peca,
      preco: p.custo,
    }));

    reparacao.estadoDiagnostico =
      pecasResult.rows.length > 0
        ? pecasResult.rows[0].estado_diagnostico
        : null;

    res.json(reparacao);
  } catch (err) {
    console.error("Erro ao obter detalhes da reparação:", err);
    res.status(500).json({ error: err.message });
  }
};

// Criar nova reparação
exports.createReparacao = async (req, res) => {
  const {
    dataRececaoEquipamento,
    dataEntregaAoCliente,
    descNaoFunciona,
    orcamentoReparacao,
    clienteId,
    empregadoId,
    codBarras,
    lojaNipc,
    compraId,
    estado = "Pendente", // Valor padrão se não vier do frontend
  } = req.body;

  try {
    const maxResult = await pool.query(
      `SELECT COALESCE(MAX(numPedidoOrcamento), 0) AS ultimo FROM reparacao WHERE lojaNipc = $1`,
      [lojaNipc]
    );
    const novoNumero = maxResult.rows[0].ultimo + 1;

    const result = await pool.query(
      `INSERT INTO reparacao (
        dataRececaoEquipamento, dataEntregaAoCliente, numPedidoOrcamento,
        descNaoFunciona, estado, orcamentoReparacao, clienteId, empregadoId,
        codBarras, lojaNipc, compraId
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        dataRececaoEquipamento,
        dataEntregaAoCliente,
        novoNumero,
        descNaoFunciona,
        estado,
        orcamentoReparacao,
        clienteId,
        empregadoId,
        codBarras,
        lojaNipc,
        compraId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar uma reparação existente
// Atualizar uma reparação existente
exports.updateReparacao = async (req, res) => {
  const {
    dataRececaoEquipamento,
    dataEntregaAoCliente,
    numPedidoOrcamento,
    descNaoFunciona,
    orcamentoReparacao,
    clienteId,
    empregadoId,
    codBarras,
    lojaNipc,
    compraId,
    estado, // <-- agora explicitamente suportado
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reparacao SET
        dataRececaoEquipamento = $1,
        dataEntregaAoCliente = $2,
        numPedidoOrcamento = $3,
        descNaoFunciona = $4,
        orcamentoReparacao = $5,
        clienteId = $6,
        empregadoId = $7,
        codBarras = $8,
        lojaNipc = $9,
        compraId = $10,
        estado = $11
      WHERE id = $12
      RETURNING *`,
      [
        dataRececaoEquipamento,
        dataEntregaAoCliente,
        numPedidoOrcamento,
        descNaoFunciona,
        orcamentoReparacao,
        clienteId,
        empregadoId,
        codBarras,
        lojaNipc,
        compraId,
        estado,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reparação não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar reparação:", err);
    res.status(500).json({ error: err.message });
  }
};

// Eliminar uma reparação
exports.deleteReparacao = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM reparacao WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reparação não encontrada" });
    }
    res.json({ message: "Reparação eliminada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReparacoesDetalhado = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.dataRececaoEquipamento,
        r.numPedidoOrcamento,
        r.descNaoFunciona,
        r.estado, -- <<<<< ADICIONAR ESTA LINHA
        r.orcamentoReparacao,
        r.codBarras,
        r.lojaNipc,
        r.empregadoId,
        p.nome AS empregadonome,
        l.nome AS lojanome,
        f.marca,
        f.modelo,
        f.tipo
      FROM reparacao r
      LEFT JOIN empregado e ON r.empregadoId = e.numInterno
      LEFT JOIN pessoa p ON e.pessoaId = p.id
      LEFT JOIN loja l ON r.lojaNipc = l.nipc
      LEFT JOIN fichaDeEquipamento f ON r.codBarras = f.codBarras
      ORDER BY r.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
