import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import interestRoutes from "./routes/interestRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

// 🔹 Configuração correta do CORS
app.use(cors({
  origin: "*", // Permite todas as origens (ajuste conforme necessário)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/interests", interestRoutes);

app.get("/", (req, res) => {
  res.send("API do BookQuest rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
