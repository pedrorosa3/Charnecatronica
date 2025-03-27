const express = require("express");
const cors = require("cors");
const equipamentosRoutes = require("./routes/equipamentos");
const comprasRoutes = require("./routes/compras");
const compraslistaRoutes = require("./routes/compraslista");
const loginRoutes = require("./routes/login");

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.use("/equipamentos", equipamentosRoutes);
app.use("/compras", comprasRoutes);
app.use("/compraslista", compraslistaRoutes);
app.use("/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ligado em http://localhost:${PORT}`);
});
