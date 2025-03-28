const db = require("../db");

const getlogin = async (req, res) => {
  const { email, password } = req.body; // Captura o e-mail e a senha enviados no request

  console.log("Dados recebidos:", req.body); // Verificando o que foi enviado

  try {
    // Consulta no banco de dados para encontrar o usuário pelo e-mail
    const result = await db.query("SELECT * FROM pessoa WHERE email = $1", [email]);

    
    if (result.rows.length > 0) {
      const user = result.rows[0]; // O usuário encontrado

      console.log(user.password);
      console.log(password);
      // Comparar a senha fornecida com a senha armazenada (não criptografada)
      if (password === user.password) {
        console.log("Login bem-sucedido");
        return res.status(201).json({ success: true, message: "Login bem-sucedido" });
      } else {
        console.log("Senha incorreta");
        return res.status(401).json({ success: false, message: "Senha incorreta" });
      }
    } else {
      // Se o e-mail não for encontrado no banco de dados
      return res.status(401).json({ success: false, message: "E-mail não encontrado" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
};

module.exports = { getlogin };
