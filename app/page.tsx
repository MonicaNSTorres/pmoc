"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalNovoUsuario from "./components/pmoc-modal-new-user/pmoc-modal-new-user";

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("pmoc_auth") || "{}");
  //const isAdmin = usuario?.email === "admin@email.com"; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      localStorage.setItem("pmoc_auth", JSON.stringify(data));
      setIsAdmin(data.admin);

      router.push("/pmoc-form");
    } catch (err) {
      alert("Erro ao fazer login.");
      console.error(err);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">Login PMOC - AMG</h2>
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-800 text-white font-semibold py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Entrar
        </button>

        <>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="w-full bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-600 cursor-pointer"
            >
              Cadastrar novo usuário
            </button>
          )}

          {mostrarModal && (
            <ModalNovoUsuario onClose={() => setMostrarModal(false)} />
          )}
        </>

      </form>
    </div>
  );
}
