const express = require("express");
const cors = require("cors");
const equipamentosRoutes = require("./routes/equipamentos");

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.use("/equipamentos", equipamentosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ligado em http://localhost:${PORT}`);
});
