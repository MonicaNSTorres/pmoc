"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import BackButton from "../components/back-button/back-button";

interface Ambiente {
  id?: number;
  nome: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  numero?: string;
  cep?: string;
  uf?: string;
}

export default function ListaAmbientes() {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<Partial<Ambiente>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAmbientes();
  }, []);

  async function fetchAmbientes() {
    const response = await axios.get("/api/listar-ambientes");
    setAmbientes(response.data);
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este Ambiente?")) return;
    await axios.delete(`/api/excluir-ambiente?id=${id}`);
    fetchAmbientes();
  }

  async function salvarEdicao() {
    if (!editingId) return;
    await axios.put(`/api/editar-ambiente?id=${editingId}`, formEdit);
    setEditingId(null);
    fetchAmbientes();
  }

  async function salvarNovoAmbiente() {
    await axios.post("/api/criar-ambiente", formEdit);
    setShowCreateModal(false);
    setFormEdit({});
    fetchAmbientes();
  }

  function abrirEdicao(ambiente: Ambiente) {
    setFormEdit(ambiente);
    setEditingId(ambiente.id!);
  }

  function handleInputChange(field: keyof Ambiente, value: string) {
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
          <h1 className="text-2xl font-bold mb-6">Ambientes Cadastrados</h1>
          <button
            onClick={() => {
              setFormEdit({ nome: "", endereco: "" });
              setShowCreateModal(true);
            }}
            className="bg-green-800 hover:bg-green-600 cursor-pointer text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Cadastrar Ambiente
          </button>
        </div>

        <table className="w-full text-sm border shadow-sm">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Rua</th>
              <th className="border p-2">Bairro</th>
              <th className="border p-2">Cidade</th>
              <th className="border p-2">Número</th>
              <th className="border p-2">CEP</th>
              <th className="border p-2">UF</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ambientes.map((ambiente) => (
              <tr key={ambiente.id} className="border-t">
                <td className="border p-2">{ambiente.nome}</td>
                <td className="border p-2">{ambiente.endereco}</td>
                <td className="border p-2">{ambiente.bairro}</td>
                <td className="border p-2">{ambiente.cidade}</td>
                <td className="border p-2">{ambiente.numero}</td>
                <td className="border p-2">{ambiente.cep}</td>
                <td className="border p-2">{ambiente.uf}</td>
                <td className="p-2 my-2 flex items-center justify-center gap-2">
                  <button onClick={() => abrirEdicao(ambiente)} className="text-blue-800 hover:text-blue-600 cursor-pointer">
                    <Pencil size={22} />
                  </button>
                  <button onClick={() => handleDelete(ambiente.id!)} className="text-red-800 hover:text-red-600 cursor-pointer">
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
                {editingId ? `Editar Ambiente` : "Nova Ambiente"}
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  editingId ? await salvarEdicao() : await salvarNovoAmbiente();
                }}
                className="space-y-3"
              >
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.nome || ""}
                  onChange={(e) =>
                    handleInputChange("nome", e.target.value)
                  }
                  placeholder="Nome do ambiente"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.endereco || ""}
                  onChange={(e) =>
                    handleInputChange("endereco", e.target.value)
                  }
                  placeholder="Endereço do ambiente"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.bairro || ""}
                  onChange={(e) =>
                    handleInputChange("bairro", e.target.value)
                  }
                  placeholder="Bairro do ambiente"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.cidade || ""}
                  onChange={(e) =>
                    handleInputChange("cidade", e.target.value)
                  }
                  placeholder="Cidade do ambiente"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.numero || ""}
                  onChange={(e) =>
                    handleInputChange("numero", e.target.value)
                  }
                  placeholder="Número do ambiente"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.cep || ""}
                  onChange={(e) =>
                    handleInputChange("cep", e.target.value)
                  }
                  placeholder="CEP do ambiente"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.uf || ""}
                  onChange={(e) =>
                    handleInputChange("uf", e.target.value)
                  }
                  placeholder="Estado/UF do ambiente"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
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
