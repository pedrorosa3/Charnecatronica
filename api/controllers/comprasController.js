const db = require("../db");

// Criar uma nova compra
const insertCompra = async (req, res) => {
  const { preco, clienteid, empregadoID, lojaNIPC, estado, modelo } = req.body;

  // Verificar se todos os campos foram preenchidos
  if (!preco || !clienteid || !empregadoID || !lojaNIPC || !estado || !modelo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  console.log('Modelo recebido (antes da normalização):', modelo); // Log para ver o modelo original

  // Normalizar o modelo (remover espaços e garantir que seja uma string limpa)
  const modeloNormalizado = modelo.trim(); // Removendo espaços extras
  console.log('Modelo normalizado:', modeloNormalizado); // Log para ver o modelo após a normalização

  try {
    // Ajustar a consulta SQL para tratar o modelo como string diretamente
    const result = await db.query(
      `SELECT Cod_barras FROM Ficha_de_Equipamento WHERE modelo = '${modeloNormalizado}'` // Adicionando as aspas diretamente aqui
    );

    console.log('Resultado da consulta Cod_barras:', result.rows); // Adicionando log para verificar o resultado da consulta

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Modelo não encontrado" });
    }

    // A chave correta é 'cod_barras' (tudo minúsculo)
    const Cod_barras = result.rows[0].cod_barras; // Alterado para 'cod_barras' minúsculo

    // Verificar se Cod_barras foi encontrado
    console.log('Código de barras encontrado:', Cod_barras);

    // Inserir a compra no banco de dados
    const compraResult = await db.query(
      `INSERT INTO Compra (Data, Preco, ClienteID, EmpregadoID, LojaNIPC, estado, Cod_barras)
       VALUES (NOW(), $1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [preco, clienteid, empregadoID, lojaNIPC, estado, Cod_barras]
    );

    res.status(201).json({
      message: "Compra registada com sucesso!",
      compra: compraResult.rows[0],
    });
  } catch (err) {
    console.error("Erro ao registar compra:", err);
    res.status(500).json({ error: "Erro ao registar compra" });
  }
};

module.exports = {
  insertCompra,
};




