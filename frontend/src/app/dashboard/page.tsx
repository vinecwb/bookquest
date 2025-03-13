"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, removeAuthToken } from "@/utils/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, BookOpen, LogOut } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  link: string;
  streak: number; // 🔥 Dias seguidos batendo meta
};

// 🔹 Busca capa do livro na Open Library API
const getOpenLibraryCover = async (title: string) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(
        title
      )}&limit=1`
    );
    const data = await response.json();

    if (data.docs.length > 0 && data.docs[0].cover_i) {
      return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
    }
  } catch (error) {
    console.error("Erro ao buscar imagem na Open Library:", error);
  }
  return "/placeholder-book.png"; // 🔹 Retorno padrão caso não encontre a capa
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🚀 Busca perfil do usuário
  const fetchUserProfile = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5005/api/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar usuário");

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      removeAuthToken();
      router.push("/login");
    }
  };

  // 📚 Busca livros recomendados
  const fetchBooks = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      let response = await fetch("http://localhost:5005/api/books/user-books", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar livros");

      let data = await response.json();

      // 🔹 Se não houver livros recomendados, solicita recomendação
      if (data.length === 0) {
        console.log("📌 Nenhum livro encontrado, solicitando recomendação...");
        response = await fetch(
          "http://localhost:5005/api/books/recommendation",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar recomendação");

        data = await response.json();
        console.log("✅ Livros recomendados:", data);
      }

      // 🔹 Atualiza imagens caso estejam ausentes
      const booksWithCovers = await Promise.all(
        data.map(async (book: Book) => ({
          ...book,
          coverUrl: book.coverUrl || (await getOpenLibraryCover(book.title)),
        }))
      );

      setBooks(booksWithCovers);
    } catch (err) {
      console.error("❌ Erro ao buscar livros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchBooks();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#B9895A] to-[#805533]">
      {/* 🏠 Menu Lateral */}
      <aside className="w-64 bg-[#6D4C3D] text-white flex flex-col p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo-litera.png" alt="Logo Litera" className="w-12 h-12" />
        </div>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">
            <span className="flex items-center gap-3 text-lg hover:bg-[#B9895A] px-4 py-2 rounded-md">
              <Home size={20} /> Início
            </span>
          </Link>
          <Link href="/dashboard/books">
            <span className="flex items-center gap-3 text-lg hover:bg-[#B9895A] px-4 py-2 rounded-md">
              <BookOpen size={20} /> Meus Livros
            </span>
          </Link>
          <button
            onClick={removeAuthToken}
            className="flex items-center gap-3 text-lg hover:bg-[#B9895A] px-4 py-2 rounded-md"
          >
            <LogOut size={20} /> Sair
          </button>
        </nav>
      </aside>

      {/* 📖 Conteúdo */}
      <main className="flex-1 flex flex-col items-center justify-start p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-[#FAF3E7] shadow-lg rounded-2xl p-6 border-[#B9895A] mb-8"
        >
          <h1 className="text-3xl font-bold text-[#6D4C3D] text-center">
            Bem-vindo, {user?.name || "Usuário"}!
          </h1>
          <p className="text-lg text-[#6D4C3D] text-center mt-2">
            Aqui estão seus livros recomendados!
          </p>
        </motion.div>

        {/* 📚 Lista de Livros Recomendados */}
        {loading ? (
          <p className="text-center text-[#6D4C3D] text-lg">
            Carregando livros...
          </p>
        ) : books.length > 0 ? (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id || `book-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#F5E9D5] shadow-lg rounded-lg overflow-hidden border border-[#B9895A]"
              >
                <Link href={`/books/${book.id}`}>
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-[#6D4C3D]">
                    {book.title}
                  </h2>
                  <p className="text-sm text-[#805533]">Autor: {book.author}</p>
                  <p className="text-sm text-[#6D4C3D] mt-2">
                    {book.description
                      ? `${book.description.substring(0, 100)}...`
                      : "Descrição não disponível"}
                  </p>
                  <p className="text-lg text-[#6D4C3D] mt-2">
                    Dias seguidos batendo meta: <strong>{book.streak}🔥</strong>
                  </p>
                  <Link href={`/books/${book.id}`}>
                    <button className="w-full mt-3 text-center text-white bg-[#B9895A] hover:bg-[#805533] py-2 px-4 rounded-md">
                      Ver Livro
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#6D4C3D] text-lg">
            Nenhum livro recomendado ainda.
          </p>
        )}
      </main>
    </div>
  );
}
