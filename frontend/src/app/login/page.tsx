"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao fazer login");

      setAuthToken(data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#B9895A] to-[#805533]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex bg-[#F5E9D5] shadow-lg rounded-2xl overflow-hidden"
      >
        {/* Seção da imagem */}
        <div className="w-1/2 hidden lg:flex items-center justify-center bg-[#D4A76A] p-10">
          <img
            src="/login-image.png"
            alt="Urso lendo um livro"
            className="max-w-full rounded-xl shadow-lg"
          />
        </div>

        {/* Seção do formulário */}
        <div className="w-full lg:w-1/2 p-10">
          <Card className="w-full bg-[#FAF3E7] border-[#B9895A]">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-[#6D4C3D]">
                Litera
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-[#B9895A] focus:ring-[#805533] focus:border-[#805533] w-full p-3 rounded-md"
                />
              </div>

              <div className="mb-4">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-[#B9895A] focus:ring-[#805533] focus:border-[#805533] w-full p-3 rounded-md"
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-[#805533] hover:bg-[#6D4C3D] text-white p-3 rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Entrar"
                )}
              </Button>

              <p className="text-center text-sm text-[#6D4C3D] mt-4">
                Ainda não tem uma conta?{" "}
                <a href="/register" className="text-[#B9895A] font-medium">
                  Cadastre-se
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
