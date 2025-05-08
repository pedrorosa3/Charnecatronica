const db = require("../db"); // Importando a configuração do banco de dados

// Função para inserir a morada no banco
const adicionarMorada = async (req, res) => {
  const { rua, numero, codigoPostal, cidade } = req.body;

  // Verificando se os campos obrigatórios estão preenchidos
  if (!rua || !numero || !codigoPostal || !cidade) {
    return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
  }

  try {
    // Definindo o valor do campo pais como "Portugal" diretamente
    const pais = "Portugal";

    // Inserindo a morada no banco de dados
    const query = `
      INSERT INTO morada (pais, rua, numero, codigopostal, localidade)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const values = [pais, rua, numero, codigoPostal, cidade];

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      // Retorna o sucesso com o ID da morada inserida
      res.status(201).json({ success: true, message: "Morada inserida com sucesso", id: result.rows[0].id });
    } else {
      // Caso não insira com sucesso
      res.status(500).json({ success: false, message: "Erro ao inserir a morada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
};

module.exports = {
  adicionarMorada,
};


