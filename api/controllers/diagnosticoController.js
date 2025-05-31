const pool = require("../db");

exports.registarDiagnostico = async (req, res) => {
  const reparacaoId = req.params.id;
  const { estadoEquipamento, pecas } = req.body;

  if (!estadoEquipamento || !Array.isArray(pecas)) {
    return res.status(400).json({ error: "Dados incompletos." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ❌ Apaga peças anteriores do diagnóstico desta reparação
    await client.query(`DELETE FROM pecasASubstituir WHERE reparacaoId = $1`, [
      reparacaoId,
    ]);

    // ✅ Insere as novas peças
    for (const peca of pecas) {
      if (!peca.nome || isNaN(parseFloat(peca.preco))) continue;

      await client.query(
        `INSERT INTO pecasASubstituir (reparacaoId, peca, custo, estadoEquipamento)
         VALUES ($1, $2, $3, $4)`,
        [reparacaoId, peca.nome, parseFloat(peca.preco), estadoEquipamento]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Diagnóstico atualizado com sucesso." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao submeter diagnóstico:", err);
    res.status(500).json({ error: "Erro ao submeter diagnóstico." });
  } finally {
    client.release();
  }
};
