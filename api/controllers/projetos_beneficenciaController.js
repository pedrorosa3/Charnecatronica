const db = require("../db");

const getProjetosBeneficencia = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                pb.ID, 
                pb.Nome, 
                pb.Descricao, 
                pb.DataLimite, 
                pb.QuantidadeEquipamentos, 
                pb.OrganizadorID, 
                pb.LojaNIPC, 
                pb.FichaEquipamentoCodBarras, 
                pb.Imagem,
                p.Nome AS NomeOrganizador,  -- Alterado para buscar o nome de 'Pessoa'
                l.Nome AS NomeLoja
            FROM ProjetoBeneficencia pb
            LEFT JOIN Organizador o ON pb.OrganizadorID = o.ID
            LEFT JOIN Pessoa p ON o.PessoaID = p.ID  -- Adicionado JOIN com Pessoa
            LEFT JOIN Loja l ON pb.LojaNIPC = l.NIPC
            ORDER BY pb.DataLimite DESC;

        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};

module.exports = { getProjetosBeneficencia };

