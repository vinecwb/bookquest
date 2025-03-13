import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 🔹 Função para cadastrar usuário com interesses
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, interests } = req.body;

    // Verifica se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "E-mail já cadastrado!" });
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // 🔹 Associa os interesses ao usuário
    if (interests?.length > 0) {
      const interestRecords = await prisma.interest.findMany({
        where: { name: { in: interests } },
      });

      if (interestRecords.length === 0) {
        res.status(400).json({ error: "Nenhum interesse válido encontrado." });
        return;
      }

      await prisma.userInterest.createMany({
        data: interestRecords.map((interest) => ({
          userId: user.id,
          interestId: interest.id,
        })),
      });
    }

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

// 🔹 Função para login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { interests: { include: { interest: true } } },
    });

    if (!user) {
      res.status(401).json({ error: "E-mail ou senha incorretos!" });
      return;
    }

    // Compara a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "E-mail ou senha incorretos!" });
      return;
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        interests: user.interests.map((i) => i.interest.name),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

// 🔹 Função para obter o perfil do usuário
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado!" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        interests: {
          select: { interest: { select: { name: true } } },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar perfil do usuário." });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        interests: {
          select: { interest: { select: { name: true } } },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar lista de usuários." });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado!" });
      return;
    }

    // Exclui o usuário
    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário." });
  }
};

