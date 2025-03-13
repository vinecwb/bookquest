"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { id: "1", name: "Ficção" },
  { id: "2", name: "Tecnologia" },
  { id: "3", name: "Negócios" },
  { id: "4", name: "História" },
  { id: "5", name: "Ciência" },
  { id: "6", name: "Autoajuda" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleRegister = async () => {
    if (selectedCategories.length < 1) {
      alert("Escolha pelo menos uma categoria!");
      return;
    }

    // ✅ Converte os IDs selecionados para nomes de categorias
    const selectedCategoryNames = selectedCategories
      .map((id) => categories.find((cat) => cat.id === id)?.name)
      .filter(Boolean); // 🔹 Remove possíveis valores undefined

    console.log("Enviando para API:", selectedCategoryNames); // 🛠️ Debug

    const response = await fetch("http://localhost:5005/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        interests: selectedCategoryNames, // 🔹 Envia os Nomes das Categorias
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || "Erro ao cadastrar usuário.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3E7]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-[#6D4C3D] text-center">
          Criar Conta
        </h2>

        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 border rounded mt-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border rounded mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <h3 className="text-lg font-semibold mt-4">
          Escolha até 3 categorias:
        </h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`p-2 border rounded ${
                selectedCategories.includes(cat.id)
                  ? "bg-[#B9895A] text-white"
                  : "bg-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-[#6D4C3D] text-white p-2 rounded mt-4"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
