import { Request, Response } from "express";
import prisma from "../config/prisma";
import { fetchBookRecommendations } from "../services/bookService";

const getUserInterests = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      interests: {
        include: { interest: true },
      },
    },
  });
};

const isBookAlreadyRecommended = async (userId: string, bookId: string) => {
  return prisma.bookUser.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
};

export const recommendBooksForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const user = await getUserInterests(req.user.id);
    if (!user || user.interests.length === 0) {
      res.status(400).json({ error: "Nenhum interesse cadastrado" });
      return;
    }

    const interests = user.interests.map((i) => i.interest.name);
    const selectedCategories = interests.sort(() => 0.5 - Math.random()).slice(0, 5);

    let recommendedBooks = [];

    for (const category of selectedCategories) {
      const book = await fetchBookRecommendations(category);
      if (!book) continue;

      let existingBook = await prisma.book.findUnique({ where: { id: book.bookId } });

      if (!existingBook) {
        existingBook = await prisma.book.create({
          data: {
            id: book.bookId,
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            description: book.description,
            link: book.link,
          },
        });
      }

      if (!(await isBookAlreadyRecommended(user.id, existingBook.id))) {
        await prisma.bookUser.create({
          data: {
            userId: user.id,
            bookId: existingBook.id,
          },
        });

        recommendedBooks.push(existingBook);
      }

      if (recommendedBooks.length >= 5) break;
    }

    if (recommendedBooks.length === 0) {
      res.status(404).json({ error: "Nenhum livro novo encontrado esta semana" });
      return;
    }

    res.json(recommendedBooks);
  } catch (error) {
    console.error("❌ Erro ao buscar recomendações:", error);
    res.status(500).json({ error: "Erro ao buscar recomendações de livros" });
  }
};

export const getUserBookRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    let books = await prisma.bookUser.findMany({
      where: { userId: req.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });

    if (books.length === 0) {
      console.log("📌 Nenhum livro encontrado, solicitando recomendação...");
      await recommendBooksForUser(req, res);
      return;
    }

    res.json(
      books.map((b) => ({
        id: b.book.id,
        title: b.book.title,
        author: b.book.author,
        coverUrl: b.book.coverUrl,
        description: b.book.description,
        link: b.book.link,
        progress: b.progress,
        streak: b.streak,
        createdAt: b.createdAt,
      }))
    );
  } catch (error) {
    console.error("❌ Erro ao buscar livros:", error);
    res.status(500).json({ error: "Erro ao buscar livros recomendados" });
  }
};

export const updateReadingProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const { bookId, progress } = req.body;

    if (!bookId || typeof progress !== "number" || progress < 0) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }

    const bookUser = await prisma.bookUser.findUnique({
      where: { userId_bookId: { userId: req.user.id, bookId } },
      include: { book: true }, // 🔹 Inclui informações do livro associado
    });

    if (!bookUser) {
      res.status(404).json({ error: "Livro não encontrado para este usuário" });
      return;
    }

    // 🔹 Adiciona verificação para garantir que dailyGoal existe
    const dailyGoal = bookUser.dailyGoal ?? 10; // Caso não exista, assume o valor padrão de 10 páginas

    const today = new Date().toISOString().split("T")[0];
    const lastReadDate = bookUser.lastReadAt ? bookUser.lastReadAt.toISOString().split("T")[0] : null;

    let streak = bookUser.streak;
    if (progress >= dailyGoal && lastReadDate !== today) {
      streak += 1;
    }

    const updatedBookUser = await prisma.bookUser.update({
      where: { userId_bookId: { userId: req.user.id, bookId } },
      data: {
        progress,
        streak,
        lastReadAt: new Date(),
      },
    });

    res.json({
      message: "Progresso atualizado com sucesso",
      progress: updatedBookUser.progress,
      streak: updatedBookUser.streak,
      lastReadAt: updatedBookUser.lastReadAt,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar progresso de leitura:", error);
    res.status(500).json({ error: "Erro ao atualizar progresso de leitura" });
  }
};
