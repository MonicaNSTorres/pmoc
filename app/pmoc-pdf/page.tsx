"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface PdfItem {
  nome: string;
  url: string;
  unidade: string;
  tag: string;
  data: string;
}

export default function ListaPDFsPMOC() {
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [filtros, setFiltros] = useState({
    unidade: "",
    tag: "",
    inicio: "",
    fim: "",
  });

  const [tagsDisponiveis, setTagsDisponiveis] = useState<string[]>([]);
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/listar-pdf");
        const todos = response.data as PdfItem[];

        // Preencher filtros únicos
        const unidades = Array.from(new Set(todos.map(p => p.unidade)));
        const tags = Array.from(new Set(todos.map(p => p.tag)));

        setPdfs(todos);
        setUnidadesDisponiveis(unidades);
        setTagsDisponiveis(tags);
      } catch (error) {
        console.error("Erro ao carregar PDFs:", error);
      }
    }
    fetchData();
  }, []);

  const filtrar = (): PdfItem[] => {
    return pdfs.filter((pdf) => {
      const matchUnidade = !filtros.unidade || pdf.unidade === filtros.unidade;
      const matchTag = !filtros.tag || pdf.tag === filtros.tag;

      const [dia, mes, ano] = pdf.data.split("/");
      const dataPdf = new Date(`${ano}-${mes}-${dia}`);

      const matchInicio = !filtros.inicio || new Date(filtros.inicio) <= dataPdf;
      const matchFim = !filtros.fim || new Date(filtros.fim) >= dataPdf;

      return matchUnidade && matchTag && matchInicio && matchFim;
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDFs PMOC Gerados</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={filtros.unidade}
          onChange={(e) => setFiltros({ ...filtros, unidade: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Todas as Unidades</option>
          {unidadesDisponiveis.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <select
          value={filtros.tag}
          onChange={(e) => setFiltros({ ...filtros, tag: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Todas as TAGs</option>
          {tagsDisponiveis.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="date"
          value={filtros.inicio}
          onChange={(e) => setFiltros({ ...filtros, inicio: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={filtros.fim}
          onChange={(e) => setFiltros({ ...filtros, fim: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* Lista */}
      <div className="bg-white border rounded shadow p-4">
        {filtrar().length === 0 && (
          <p className="text-gray-600">Nenhum PDF encontrado com os filtros atuais.</p>
        )}

        <ul className="space-y-2">
          {filtrar().map((pdf, index) => (
            <li key={index} className="flex justify-between items-center border-b py-2">
              <span>
                <strong>{pdf.unidade}</strong> - <em>{pdf.tag}</em> - {pdf.data}
              </span>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Abrir PDF
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
