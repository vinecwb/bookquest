import cron from "node-cron";
import prisma from "../config/prisma";
import { recommendBooksForUser } from "../controllers/bookController";

// 🔹 Executa toda segunda-feira às 9h
cron.schedule("0 9 * * 1", async () => {
  console.log("📚 Gerando recomendações semanais para todos os usuários...");

  const users = await prisma.user.findMany();
  
  for (const user of users) {
    try {
      await recommendBooksForUser({ user } as any, {} as any);
      console.log(`✅ Recomendação enviada para ${user.email}`);
    } catch (error) {
      console.error(`❌ Erro ao recomendar livros para ${user.email}`, error);
    }
  }
});
