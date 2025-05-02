const db = require("../db");

const getCompraLista = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        Compra.ID, 
        Compra.Data, 
        Compra.Preco, 
        Cliente.ID AS ClienteID, 
        PessoaCliente.Nome AS ClienteNome,
        Empregado.NumInterno AS EmpregadoID, 
        PessoaEmpregado.Nome AS EmpregadoNome,
        Loja.Nome AS LojaNome, 
        Loja.NIPC AS LojaNIPC,
        Ficha_de_Equipamento.Cod_barras AS EquipamentoCodBarras, 
        Ficha_de_Equipamento.Marca AS EquipamentoMarca,
        Ficha_de_Equipamento.Modelo AS EquipamentoModelo
      FROM Compra
      JOIN Cliente ON Compra.ClienteID = Cliente.ID
      JOIN Pessoa AS PessoaCliente ON Cliente.PessoaID = PessoaCliente.ID
      JOIN Empregado ON Compra.EmpregadoID = Empregado.NumInterno
      JOIN Pessoa AS PessoaEmpregado ON Empregado.PessoaID = PessoaEmpregado.ID
      JOIN Loja ON Compra.LojaNIPC = Loja.NIPC
      JOIN Ficha_de_Equipamento ON Compra.Cod_barras = Ficha_de_Equipamento.Cod_barras
      ORDER BY Compra.Data DESC
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
    const result = await db.query(`
      SELECT 
        Compra.ID, 
        Compra.Data, 
        Compra.Preco,
        COmpra.estado,
        Compra.MetodoPagamento,

        -- Cliente
        Cliente.ID AS ClienteID, 
        PessoaCliente.Nome AS ClienteNome,
        PessoaCliente.Email AS ClienteEmail,
        PessoaCliente.Telemovel AS ClienteTelemovel,

        -- Empregado
        Empregado.NumInterno AS EmpregadoID, 
        PessoaEmpregado.Nome AS EmpregadoNome,
        PessoaEmpregado.Email AS EmpregadoEmail,
        PessoaEmpregado.Telemovel AS EmpregadoTelemovel,

        -- Loja
        Loja.Nome AS LojaNome, 
        Loja.NIPC AS LojaNIPC,
        Loja.NumeroTelefone AS LojaTelefone,

        -- Morada da Loja
        Morada.Rua AS LojaRua,
        Morada.Numero AS LojaNumero,
        Morada.Localidade AS LojaLocalidade,
        Morada.Concelho AS LojaConcelho,
        Morada.Distrito AS LojaDistrito,
        Morada.CodigoPostal AS LojaCodigoPostal,

        -- Equipamento
        Ficha_de_Equipamento.Cod_barras AS EquipamentoCodBarras, 
        Ficha_de_Equipamento.Marca AS EquipamentoMarca,
        Ficha_de_Equipamento.Modelo AS EquipamentoModelo,
        Ficha_de_Equipamento.Tipo AS EquipamentoTipo,
        Ficha_de_Equipamento.Ano_lancamento AS EquipamentoAnoLancamento,

        -- Imagem do Equipamento
        (
          SELECT url 
          FROM imagens_equipamento 
          WHERE cod_barras = Ficha_de_Equipamento.Cod_barras 
          LIMIT 1
        ) AS EquipamentoImagemURL

      FROM Compra

      -- Relações
      JOIN Cliente ON Compra.ClienteID = Cliente.ID
      JOIN Pessoa AS PessoaCliente ON Cliente.PessoaID = PessoaCliente.ID

      JOIN Empregado ON Compra.EmpregadoID = Empregado.NumInterno
      JOIN Pessoa AS PessoaEmpregado ON Empregado.PessoaID = PessoaEmpregado.ID

      JOIN Loja ON Compra.LojaNIPC = Loja.NIPC
      JOIN Morada ON Loja.MoradaID = Morada.ID

      JOIN Ficha_de_Equipamento ON Compra.Cod_barras = Ficha_de_Equipamento.Cod_barras

      WHERE Compra.ID = $1
    `, [id]);

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




