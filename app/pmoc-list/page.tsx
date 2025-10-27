"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import PMOCFormEditable from "../components/pmoc-modal-edit/pmoc-modal-edit";
import BackButton from "../components/back-button/back-button";

interface PMOC {
  id: number;
  nomeAmbiente: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone: string;
  nomeProprietario: string;
  cgcProprietario: string;
  enderecoProprietario: string;
  nomeResponsavel: string;
  cgcResponsavel: string;
  conselho: string;
  art: string;
  criadoEm: string;
  tag?: {
    tag: string;
    unidade: string;
  };
  ambiente?: {
    nome: string;
  };
}

export default function ListaPMOC() {
  const [pmocs, setPmocs] = useState<PMOC[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<Partial<PMOC>>({});
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  //const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [ambienteSelecionado, setAmbienteSelecionado] = useState("");
  const [unidades, setUnidades] = useState<{ nome: string }[]>([]);
  const [periodicidade, setPeriodicidade] = useState("Mensal");


  useEffect(() => {
    fetchPmocs();
    fetchUnidades();
  }, []);

  async function fetchUnidades() {
    const response = await axios.get("/api/unidades");
    setUnidades(response.data);
  }

  async function fetchPmocs() {
    const params: any = {};
    if (dataInicio) params.inicio = dataInicio;
    if (dataFim) params.fim = dataFim;

    const response = await axios.get("/api/listar-pmocs", { params });
    setPmocs(response.data);
  }

  async function handleDelete(id: number) {
    const confirmar = confirm("Tem certeza que deseja excluir este PMOC?");
    if (!confirmar) return;
    await axios.delete(`/api/excluir-pmoc?id=${id}`);
    fetchPmocs();
  }

  async function abrirEdicao(pmoc: PMOC) {
    const response = await axios.get(`/api/pmoc?id=${pmoc.id}`);
    setFormEdit(response.data);
    setEditingId(pmoc.id);
  }

  async function salvarEdicao() {
    if (!editingId) return;
    await axios.put(`/api/editar-pmoc?id=${editingId}`, formEdit);
    setEditingId(null);
    fetchPmocs();
  }

  function handleInputChange(field: keyof PMOC, value: string) {
    setFormEdit((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGerarPMOCs() {
    if (!ambienteSelecionado) return;

    try {
      /*await axios.post("/api/pmoc/gerar-multiplo", {
        unidade: ambienteSelecionado,
      });*/
      await axios.post("/api/pmoc/gerar-multiplo", {
        unidade: ambienteSelecionado,
        periodicidade,
      });

      alert("PMOCs gerados com sucesso!");
      fetchPmocs();
    } catch (error: any) {
      console.error("Erro ao gerar PMOCs:", error);
      alert("Erro ao gerar PMOCs: " + (error?.response?.data?.error || "Erro desconhecido"));
    }

  }



  return (
    <div className="flex flex-col pl-[9%] pr-[10%] min-h-screen bg-gray-200 p-4">
      <div className="max-w-8xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">PMOCs Cadastrados</h1>

        <div className="flex flex-col gap-4 mb-6">
          {/* Linha de filtros */}
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={fetchPmocs}
              className="bg-blue-800 hover:bg-blue-600 cursor-pointer text-white font-semibold px-4 py-2 rounded flex items-center"
            >
              Filtrar
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">
                Gerar TAG por unidade
              </label>
              <select
                value={ambienteSelecionado}
                onChange={(e) => setAmbienteSelecionado(e.target.value)}
                className="border px-3 py-2 text-sm rounded"
              >
                <option value="">Selecione a Unidade</option>
                {unidades.map((u) => (
                  <option key={u.nome} value={u.nome}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">
                Periodicidade
              </label>
              <select
                value={periodicidade}
                onChange={(e) => setPeriodicidade(e.target.value)}
                className="border px-3 py-2 text-sm rounded"
              >
                <option value="Todos">Todos</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
              </select>
            </div>

            <div className="pt-6">
              <button
                onClick={handleGerarPMOCs}
                disabled={!ambienteSelecionado}
                className="bg-green-700 hover:bg-green-600 cursor-pointer text-white font-semibold px-4 py-2 rounded flex items-center"
              >
                Gerar
              </button>
            </div>
          </div>
        </div>


        <div className="overflow-auto">
          <table className="w-full text-md border bg-white shadow-md">
            <thead className="text-gray-700 bg-blue-100">
              <tr>
                <th className="border p-2">TAG</th>
                <th className="border p-2">Unidade</th>
                <th className="border p-2">Ambiente</th>
                <th className="border p-2">Cidade</th>
                <th className="border p-2">Data Cadastro</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pmocs.map((pmoc) => (
                <tr key={pmoc.id} className="border-t">
                  <td className="border p-2">{pmoc.tag?.tag || "-"}</td>
                  <td className="border p-2">{pmoc.tag?.unidade || "-"}</td>
                  <td className="border p-2">{pmoc.ambiente?.nome || pmoc.nomeAmbiente}</td>
                  <td className="border p-2">{pmoc.cidade}</td>
                  <td className="border p-2">{new Date(pmoc.criadoEm).toLocaleDateString()}</td>
                  <td className="p-2 my-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => abrirEdicao(pmoc)}
                      className="text-blue-800 hover:text-blue-600 cursor-pointer"
                    >
                      <Pencil size={22} />
                    </button>
                    <button
                      onClick={() => handleDelete(pmoc.id)}
                      className="text-red-800 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded shadow max-w-4xl w-full">
              <h2 className="text-xl font-semibold mb-4">Editar PMOC #{editingId}</h2>
              <PMOCFormEditable
                initialData={formEdit}
                onCancel={() => setEditingId(null)}
                onSave={async (data) => {
                  await axios.put(`/api/editar-pmoc?id=${editingId}`, data);
                  setEditingId(null);
                  fetchPmocs();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
