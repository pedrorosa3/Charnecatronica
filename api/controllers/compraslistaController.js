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
        Equipamentos.ID AS EquipamentosID,  -- Tabela agora chamada 'Equipamentos'
        Equipamentos.Nome AS EquipamentosNome  -- Alias para o nome do equipamento
      FROM Compra
      JOIN Cliente ON Compra.ClienteID = Cliente.ID
      JOIN Pessoa AS PessoaCliente ON Cliente.PessoaID = PessoaCliente.ID
      JOIN Empregado ON Compra.EmpregadoID = Empregado.NumInterno
      JOIN Pessoa AS PessoaEmpregado ON Empregado.PessoaID = PessoaEmpregado.ID
      JOIN Loja ON Compra.LojaNIPC = Loja.NIPC
      JOIN Equipamentos ON Compra.EquipamentoID = Equipamentos.ID  -- Referência corrigida
      ORDER BY Compra.Data DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ error: "Erro ao buscar compras" });
  }
};

module.exports = { getCompraLista };



