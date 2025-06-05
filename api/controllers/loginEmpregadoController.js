const db = require("../db");

const getlogin2 = async (req, res) => {
  const { email, password } = req.body;
  console.log("VITORRR");
  
  console.log("Dados recebidos:", req.body);

  try {
    // Consulta na tabela "pessoa"
    const result = await db.query("SELECT * FROM pessoa WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      console.log(user.password);
      console.log(password);

      // Comparar senha (nota: isto não é seguro se as passwords estiverem em plain text)
      if (password === user.password) {
        console.log("Login bem-sucedido");
        return res.status(200).json({
          success: true,
          message: "Login bem-sucedido",
          userId: user.id,
          nome: user.nome,
          email: user.email,
        });
      } else {
        console.log("Senha incorreta");
        return res
          .status(401)
          .json({ success: false, message: "Senha incorreta" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "E-mail não encontrado" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
};

module.exports = { getlogin2 };
