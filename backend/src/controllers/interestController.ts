import { Request, Response } from "express";
import prisma from "../config/prisma";

export const addUserInterests = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const { interests } = req.body; // Recebemos um array de interesses
    if (!Array.isArray(interests) || interests.length === 0) {
      res.status(400).json({ error: "É necessário informar pelo menos um interesse" });
      return;
    }

    // Busca os interesses pelo nome
    const interestRecords = await prisma.interest.findMany({
      where: { name: { in: interests } },
    });

    if (interestRecords.length === 0) {
      res.status(400).json({ error: "Nenhum interesse válido encontrado" });
      return;
    }

    // Adiciona os interesses ao usuário
    await prisma.userInterest.createMany({
      data: interestRecords.map((interest) => ({
        userId: req.user!.id,
        interestId: interest.id,
      })),
      skipDuplicates: true, // Evita duplicatas
    });

    res.json({ message: "Interesses adicionados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar interesses" });
  }
};
