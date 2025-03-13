"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 🔹 Tipo para armazenar informações do livro
type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  link: string;
};

export default function BookDetailsPage() {
  const { id } = useParams(); // 📌 Captura o ID da URL
  const router = useRouter(); // Para redirecionamento em caso de erro
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📌 ID do livro recebido:", id);

    if (!id) {
      console.error("❌ Nenhum ID fornecido, voltando para o Dashboard...");
      router.push("/dashboard");
      return;
    }

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5005/api/books/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar detalhes do livro");

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do livro:", error);
        router.push("/dashboard"); // Redireciona caso o livro não exista
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-[#6D4C3D]">Carregando...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Livro não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-[#FAF3E7]">
      {/* 🔙 Botão de voltar */}
      <Link
        href="/dashboard"
        className="absolute top-6 left-6 flex items-center text-[#6D4C3D] hover:text-[#B9895A]"
      >
        <ArrowLeft size={24} />
        <span className="ml-2">Voltar</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 border-[#B9895A]"
      >
        <img
          src={book.coverUrl || "/placeholder-book.png"}
          alt={book.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        <h1 className="text-3xl font-bold text-[#6D4C3D] mt-4">{book.title}</h1>
        <p className="text-lg text-[#805533] mt-2">Autor: {book.author}</p>
        <p className="text-md text-[#6D4C3D] mt-4">
          {book.description || "Descrição não disponível."}
        </p>

        {/* 🔹 Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a
            href={`https://www.amazon.com.br/s?k=${encodeURIComponent(
              book.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-white bg-[#B9895A] hover:bg-[#805533] py-3 px-4 rounded-md"
          >
            Comprar Livro
          </a>

          <button className="flex-1 text-center bg-[#6D4C3D] text-white hover:bg-[#B9895A] py-3 px-4 rounded-md">
            Adicionar à Minha Lista
          </button>
        </div>
      </motion.div>
    </div>
  );
}
