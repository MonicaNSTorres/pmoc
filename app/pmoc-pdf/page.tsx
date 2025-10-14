"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MailPlus, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import BackButton from "../components/back-button/back-button";

/*assinatura embutida (Luiz Pellegrini), derivada da imagem enviada*/
const SIGNATURE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAABhCAIAAACvYVH1AAAQAElEQVR4AexcBzxV7R8/d4RQ2iWV3oZ2" +
  "..." +
  " (TRUNCADO PARA BREVIDADE – USE O VALOR COMPLETO ABAIXO) ";

/* -------------- VALOR COMPLETO --------------
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAABhCAIAAACvYVH1AAAQAElEQVR4AexcBzxV7R8/d4RQ2iWV3oZ2
---------------------------------------------------------------- */

interface PMOC {
  id: number;
  criadoEm: string;
  tag?: {
    tag: string;
    unidade: string;
  };
}

export default function ListaPDFsPMOC() {
  const [pmocs, setPmocs] = useState<PMOC[]>([]);
  const [filtros, setFiltros] = useState({ unidade: "", tag: "", inicio: "", fim: "" });
  const [tagsDisponiveis, setTagsDisponiveis] = useState<string[]>([]);
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/listar-pmocs");
        const todos = response.data as PMOC[];

        setPmocs(todos);

        const unidades = Array.from(
          new Set(todos.map((p) => p.tag?.unidade).filter(Boolean))
        ) as string[];

        const tags = Array.from(
          new Set(todos.map((p) => p.tag?.tag).filter(Boolean))
        ) as string[];

        setUnidadesDisponiveis(unidades);
        setTagsDisponiveis(tags);

      } catch (error) {
        console.error("Erro ao carregar PMOCs:", error);
      }
    }

    fetchData();
  }, []);

  const filtrar = (): PMOC[] => {
    return pmocs
      .filter((pmoc) => {
        const unidade = pmoc.tag?.unidade || "";
        const tag = pmoc.tag?.tag || "";
        const data = new Date(pmoc.criadoEm);

        const matchUnidade = !filtros.unidade || unidade === filtros.unidade;
        const matchTag = !filtros.tag || tag === filtros.tag;
        const matchInicio = !filtros.inicio || new Date(filtros.inicio) <= data;
        const matchFim = !filtros.fim || new Date(filtros.fim) >= data;

        return matchUnidade && matchTag && matchInicio && matchFim;
      })
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  };

  const gerarPdfPMOC = async (pmocId: number) => {
    const { data: pmoc } = await axios.get(`/api/pmoc?id=${pmocId}`);
    const [tags, ambientes, servicos] = await Promise.all([
      axios.get("/api/tags"),
      axios.get("/api/ambientes"),
      axios.get("/api/servicos"),
    ]);

    const ambienteSelecionado = ambientes.data.find((a: any) => String(a.id) === String(pmoc.ambienteId));
    const tagSelecionada = tags.data.find((t: any) => String(t.id) === String(pmoc.tagId));

    const checklist = (pmoc.checklist || []).map((item: any) => {
      const servico = servicos.data.find((s: any) => String(s.id) === String(item.descricao));
      return {
        descricao: servico?.nome || item.descricao,
        periodicidade: item.periodicidade || "-",
        data: item.dataExecucao?.split("T")[0] || "-",
        executadoPor: item.executadoPor || "-",
      };
    });

    const formatarDataBR = (data: string): string => {
      if (!data) return "";
      const [ano, mes, dia] = data.split("T")[0].split("-");
      return `${dia}/${mes}/${ano}`;
    };

    const doc = new jsPDF();
    const hoje = new Date();
    const dataGeracao = hoje.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let y = 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PLANO DE MANUTENÇÃO, OPERAÇÃO E CONTROLE - PMOC", 105, y, { align: "center" });

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("1 - IDENTIFICAÇÃO DO AMBIENTE OU CONJUNTO DE AMBIENTES:", 10, y);

    y += 7;
    doc.setFont("helvetica", "normal");

    const linhaNome = `NOME: SICOOB CRESSEM`;
    doc.text(linhaNome, 10, y);
    doc.rect(9, y - 5, 190, 7);
    y += 8;

    const linhaTag = `TAG: ${tagSelecionada ? `${tagSelecionada.tag.toUpperCase()} - ${tagSelecionada.unidade.toUpperCase()} - ${tagSelecionada.local.toUpperCase()}` : ""}`;
    doc.text(linhaTag, 10, y);
    doc.rect(9, y - 5, 190, 7);
    y += 8;


    /*const endereco = `ENDEREÇO: ${formData.endereco?.toUpperCase() || ""}, Nº: ${formData.numero || ""}`;
    const complemento = `COMPLEMENTO: ${formData.bairro?.toUpperCase() || ""} / ${formData.cidade?.toUpperCase() || ""} / ${formData.uf?.toUpperCase() || ""}`;
    const cep = `CEP: ${ambienteSelecionado?.cep || ""}`;
    doc.text(endereco, 10, y);
    doc.rect(9, y - 5, 190, 7); // Borda
    y += 8;
    doc.text(`${complemento} - ${cep}`, 10, y);
    doc.rect(9, y - 5, 190, 7); // Borda
    y += 8;*/

    const enderecoCompleto = `ENDEREÇO: ${pmoc.endereco?.toUpperCase() || ""}, Nº: ${pmoc.numero || ""} / ${pmoc.cidade?.toUpperCase() || ""} / ${pmoc.uf?.toUpperCase() || ""} - CEP: ${ambienteSelecionado?.cep || ""}`;
    doc.text(enderecoCompleto, 10, y);
    doc.rect(9, y - 5, 190, 7);
    y += 8;

    const cnpj = `CNPJ: ${ambienteSelecionado?.cnpj || ""}`;
    doc.text(cnpj, 10, y);
    doc.rect(9, y - 5, 190, 7);
    y += 8;

    const contrato = `CONTRATO: AMG 300525`;
    doc.text(contrato, 10, y);
    doc.rect(9, y - 5, 190, 7);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("3 - IDENTIFICAÇÃO DO RESPONSÁVEL TÉCNICO:", 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");

    const nomeResp = `NOME: ${pmoc.nomeResponsavel?.toUpperCase() || ""}`;
    doc.text(nomeResp, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 8;

    const creasp = `CREASP: ${pmoc.cgcResponsavel?.toUpperCase() || ""}`;
    doc.text(creasp, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 8;

    const conselho = `REGISTRO NO CONSELHO: ${pmoc.conselho?.toUpperCase() || ""}`;
    doc.text(conselho, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 8;

    const art = `ART: ${pmoc.art?.toUpperCase() || ""}`;
    doc.text(art, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 10;

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("5 - Plano de Manutenção e Controle", 10, y);

    autoTable(doc, {
      startY: y + 2,
      head: [["Descrição", "Periodicidade", "Data Execução", "Executado por", "Aprovado por"]],
      body: checklist.map((item: any) => [
        item.descricao,
        item.periodicidade,
        formatarDataBR(item.data),
        item.executadoPor,
        "",
      ]),
      styles: {
        fontSize: 7,
        cellPadding: 3,
      },
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontSize: 8 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setFont("helvetica", "normal");

    try {
      doc.addImage(SIGNATURE_DATA_URL, "PNG", 122, finalY - 14, 60, 18);
    } catch (e) {
      console.warn("Falha ao inserir assinatura:", e);
    }

    doc.line(120, finalY, 190, finalY);
    doc.text("ENGENHEIRO RESPONSÁVEL", 130, finalY + 6);

    const nomeArquivo = tagSelecionada
      ? `${tagSelecionada.unidade}-${tagSelecionada.tag}-${dataGeracao}`.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_")
      : `PMOC-${dataGeracao}`;

    const blob = doc.output("blob");

    return {
      blob,
      nomeArquivo,
      metadata: {
        tag: tagSelecionada?.tag || "",
        unidade: tagSelecionada?.unidade || "",
        data: dataGeracao,
      },
    };
  };

  const handleGerarPdf = async (pmocId: number) => {
    try {
      const { blob, nomeArquivo } = await gerarPdfPMOC(pmocId);
      saveAs(blob, `${nomeArquivo}.pdf`);
    } catch (err) {
      alert("Erro ao gerar PDF.");
      console.error(err);
    }
  };

  const handleEnviarEmail = async (pmocId: number) => {
    try {
      const { blob, nomeArquivo, metadata } = await gerarPdfPMOC(pmocId);
      const formData = new FormData();
      formData.append("pdf", blob, `${nomeArquivo}.pdf`);
      formData.append("nome", nomeArquivo);
      formData.append("tag", metadata.tag);
      formData.append("unidade", metadata.unidade);
      formData.append("data", metadata.data);

      await axios.post("/api/enviar-pdf-email", formData);
      alert("PDF enviado por e-mail com sucesso!");
    } catch (err) {
      alert("Erro ao enviar e-mail.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col pl-[9%] pr-[10%] min-h-screen bg-gray-200 p-4">
      <div className="max-w-8xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">PMOCs PDF</h1>

        {/* Filtros */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1 font-semibold">Unidade</label>
            <select
              value={filtros.unidade}
              onChange={(e) => setFiltros({ ...filtros, unidade: e.target.value })}
              className="border px-3 py-2 text-sm rounded"
            >
              <option value="">Todas as Unidades</option>
              {unidadesDisponiveis.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1 font-semibold">TAG</label>
            <select
              value={filtros.tag}
              onChange={(e) => setFiltros({ ...filtros, tag: e.target.value })}
              className="border px-3 py-2 text-sm rounded"
            >
              <option value="">Todas as TAGs</option>
              {tagsDisponiveis.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1 font-semibold">Data Início</label>
            <input
              type="date"
              value={filtros.inicio}
              onChange={(e) => setFiltros({ ...filtros, inicio: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1 font-semibold">Data Fim</label>
            <input
              type="date"
              value={filtros.fim}
              onChange={(e) => setFiltros({ ...filtros, fim: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-auto">
          {filtrar().length === 0 ? (
            <p className="text-gray-600">Nenhum PMOC encontrado com os filtros atuais.</p>
          ) : (
            <table className="w-full text-sm border bg-white shadow-md">
              <thead className="text-gray-700 bg-blue-100">
                <tr>
                  <th className="border p-2">Unidade</th>
                  <th className="border p-2">TAG</th>
                  <th className="border p-2">Data</th>
                  <th className="border p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrar().map((pmoc) => (
                  <tr key={pmoc.id} className="border-t">
                    <td className="border p-2">{pmoc.tag?.unidade || "-"}</td>
                    <td className="border p-2">{pmoc.tag?.tag || "-"}</td>
                    <td className="border p-2">
                      {new Date(pmoc.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-2 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleGerarPdf(pmoc.id)}
                        className="bg-blue-800 hover:bg-blue-600 cursor-pointer text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <FileDown size={16} /> Gerar PDF
                      </button>
                      <button
                        onClick={() => handleEnviarEmail(pmoc.id)}
                        className="hover:bg-green-600 cursor-pointer text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <MailPlus size={16} /> Enviar Email
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
