"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import BackButton from "../components/back-button/back-button";

interface Servico {
  id?: number;
  nome: string;
}

export default function ListarServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<Partial<Servico>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchServicos();
  }, []);

  async function fetchServicos() {
    const response = await axios.get("/api/listar-servicos");
    setServicos(response.data);
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir esta TAG?")) return;
    await axios.delete(`/api/excluir-servico?id=${id}`);
    fetchServicos();
  }

  async function salvarEdicao() {
    if (!editingId) return;
    await axios.put(`/api/editar-servico?id=${editingId}`, formEdit);
    setEditingId(null);
    fetchServicos();
  }

  async function salvarNovoServico() {
    await axios.post("/api/criar-servico", formEdit);
    setShowCreateModal(false);
    setFormEdit({});
    fetchServicos();
  }

  function abrirEdicao(servico: Servico) {
    setFormEdit(servico);
    setEditingId(servico.id!);
  }

  function handleInputChange(field: keyof Servico, value: string) {
    setFormEdit((prev) => ({ ...prev, [field]: value }));
  }

  const closeModal = () => {
    setEditingId(null);
    setShowCreateModal(false);
  };


  return (
    <div className="flex flex-col pl-[9%] pr-[10%] min-h-screen bg-gray-200 p-4">
      <div className="max-w-8xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <BackButton />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-6">Serviços Cadastrados</h1>
          <button
            onClick={() => {
              setFormEdit({ nome: "" });
              setShowCreateModal(true);
            }}
            className="bg-green-800 hover:bg-green-600 cursor-pointer text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Cadastrar Servico
          </button>
        </div>

        <table className="w-full text-sm border shadow-sm">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico) => (
              <tr key={servico.id} className="border-t">
                <td className="border p-2">{servico.nome}</td>
                <td className="p-2 my-2 flex items-center justify-center gap-2">
                  <button onClick={() => abrirEdicao(servico)} className="text-blue-800 hover:text-blue-600 cursor-pointer">
                    <Pencil size={22} />
                  </button>
                  <button onClick={() => handleDelete(servico.id!)} className="text-red-800 hover:text-red-600 cursor-pointer">
                    <Trash2 size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(editingId || showCreateModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={closeModal}>
            <div className="relative bg-white p-6 rounded shadow-md w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <X size={30} className="absolute top-4 right-4 cursor-pointer font-semibold text-gray-500 hover:text-red-600 text-lg" onClick={closeModal} />
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? `Editar Servico` : "Nova Servico"}
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  editingId ? await salvarEdicao() : await salvarNovoServico();
                }}
                className="space-y-3"
              >
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.nome || ""}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Nome do serviço"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setShowCreateModal(false);
                    }}
                    className="border px-4 py-2 rounded hover:cursor-pointer">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-800 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-blue-600">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
