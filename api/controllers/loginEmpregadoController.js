const db = require("../db");

const getlogin2 = async (req, res) => {
  const { numInterno, password } = req.body;

  //console.log("Tentativa de login:", req.body);

  // Caso especial: login hardcoded para admin
  if (
    (numInterno === 'admin' && password === 'admin') ||
    (numInterno === '0000' && password === 'admin')
  ) {
    return res.status(200).json({
      success: true,
      message: "Login como administrador bem-sucedido",
      numInterno: numInterno,
      nome: "Administrador",
      email: "admin@sistema.com"
    });
  }

  try {
    const result = await db.query(
      `SELECT e.numInterno, p.nome, p.email, p.password
       FROM empregado e
       JOIN pessoa p ON e.pessoaId = p.id
       WHERE e.numInterno = $1`,
      [numInterno]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Empregado não encontrado" });
    }

    const user = result.rows[0];

    // Comparação simples de senha
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Senha incorreta" });
    }

    return res.status(200).json({
      success: true,
      message: "Login bem-sucedido",
      numInterno: user.numInterno,
      nome: user.nome,
      email: user.email,
    });

  } catch (err) {
    console.error("Erro ao fazer login:", err);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
};

module.exports = { getlogin2 };
