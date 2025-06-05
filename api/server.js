const express = require("express");
const cors = require("cors");
const equipamentosRoutes = require("./routes/equipamentos");
const comprasRoutes = require("./routes/compras");
const compraslistaRoutes = require("./routes/compraslista");
const loginRoutes = require("./routes/login");
const projetos_beneficenciaRoutes = require("./routes/projetos_beneficencia");
const addProjetoRoutes = require("./routes/add_projeto");
const lojasRoutes = require("./routes/lojas");
const clientesRoutes = require("./routes/clientes");
const fichasRoutes = require("./routes/fichas");
const perfilRoutes = require("./routes/perfil");
const paymentRoutes = require("./routes/payment");
const moradaRoutes = require("./routes/morada");
const pessoaRoutes = require("./routes/pessoa");
const vendaRoutes = require("./routes/venda");
const vendaslistaRoutes = require("./routes/vendaslista");
const reparacoesRoutes = require("./routes/reparacoes");
const diagnosticoRoutes = require("./routes/diagnostico");
const loginEmpregadoRoutes = require("./routes/login_empregado");
const vendaFisicaRouter = require("./routes/vendaFisica");

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.use("/equipamentos", equipamentosRoutes);
app.use("/compras", comprasRoutes);
app.use("/compraslista", compraslistaRoutes);
app.use("/login", loginRoutes);
app.use("/projetos_beneficencia", projetos_beneficenciaRoutes);
app.use("/adicionar-projeto", addProjetoRoutes);
app.use("/lojas", lojasRoutes);
app.use("/clientes", clientesRoutes);
app.use("/fichas", fichasRoutes);
app.use("/perfil", perfilRoutes);
app.use("/morada", moradaRoutes);
app.use("/pessoa", pessoaRoutes);
app.use("/venda", vendaRoutes);
app.use("/vendaslista", vendaslistaRoutes);
app.use(paymentRoutes);
app.use("/reparacoes", reparacoesRoutes);
app.use("/pecasDiagnostico", diagnosticoRoutes);
app.use("/loginempregado", loginEmpregadoRoutes);
app.use("/vendaFisica", vendaFisicaRouter);
app.get("/testAPI", (req, res) => {
  res.json({ message: "API a funcionar corretamente!" });
});

app.listen(PORT, () => {
  console.log(`Servidor ligado em http://localhost:${PORT}`);
});
