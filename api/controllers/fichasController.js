const db = require("../db"); // Certifique-se de que a conexão com o DB esteja configurada corretamente

// Obter todas as fichas de equipamento
const getFichas = async (req, res) => {
  try {
    // Consulta SQL para buscar todas as fichas de equipamento
    const result = await db.query(`
      SELECT 
        Cod_barras AS codBarras,
        Marca AS marca,
        Modelo AS modelo,
        Tipo AS tipo,
        Preco_base AS precoBase,
        Ano_lancamento AS anoLancamento
      FROM Ficha_de_Equipamento
      ORDER BY Marca, Modelo;
    `);

    // Retornar as fichas de equipamento em formato JSON
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar fichas:", error);
    res.status(500).json({ error: "Erro ao buscar fichas de equipamento" });
  }
};

module.exports = {
  getFichas,
};
