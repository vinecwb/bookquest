import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 🔹 Função para cadastrar usuário
export const registerUser = async (name: string, email: string, password: string | null) => {
  if (!password) {
    throw new Error("Senha inválida!"); // Garante que não seja null
  }

  // Verifica se o e-mail já está cadastrado
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("E-mail já cadastrado!");
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criação do usuário
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { id: user.id, name: user.name, email: user.email };
};

// 🔹 Função para login
export const loginUser = async (email: string, password: string) => {
  // Verifica se o usuário existe
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("E-mail ou senha incorretos!");
  }

  // Compara a senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("E-mail ou senha incorretos!");
  }

  // Gera o token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};