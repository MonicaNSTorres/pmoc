"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { X } from "lucide-react";

/*assinatura embutida (Luiz Pellegrini), derivada da imagem enviada*/
const SIGNATURE_DATA_URL =
  "data:image/jpeg;base64,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";

/* -------------- VALOR COMPLETO --------------
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAABhCAIAAACvYVH1AAAQAElEQVR4AexcBzxV7R8/d4RQ2iWV3oZ2
---------------------------------------------------------------- */

interface PMOCFormData {
  nomeAmbiente: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  nomeProprietario: string;
  cgcProprietario?: string; // opcional
  //enderecoProprietario: string;
  nomeResponsavel: string;
  cgcResponsavel: string;
  conselho: string;
  art: string;
  tagSelecionada: string;
  ambienteSelecionado: string;
  servicoSelecionado: string;
  contrato: string;
  cnpj: string;
  cep: string;
}

interface ChecklistItem {
  descricao: string;
  periodicidade: string;
  data: string;
  executadoPor: string;
  //aprovadoPor: string;
}

interface Props {
  initialData: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function PMOCFormEditable({ initialData, onCancel, onSave }: Props) {
  const [formData, setFormData] = useState<PMOCFormData>({
    nomeAmbiente: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    cnpj: "",
    cep: "",
    //telefone: "",
    nomeProprietario: "Sicoob Cressem",
    //cgcProprietario: "",
    //enderecoProprietario: "",
    nomeResponsavel: "",
    cgcResponsavel: "",
    conselho: "",
    art: "",
    tagSelecionada: "",
    ambienteSelecionado: "",
    servicoSelecionado: "",
    contrato: "AMG 300525",
  });


  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; tag: string; unidade: string; local: string }[]>([]);
  const [ambientes, setAmbientes] = useState<{ id: number; nome: string; cnpj?: string; cep?: string }[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("formData.ambienteSelecionado:", formData.ambienteSelecionado);
    console.log("formData.tagSelecionada:", formData.tagSelecionada);
    console.log("ambientes disponíveis:", ambientes);
    console.log("tags disponíveis:", tags);
  }, [formData, ambientes, tags]);

  useEffect(() => {
    if (servicos.length > 0 && initialData?.checklist) {
      const checklistFormatado = initialData.checklist.map((item: any): ChecklistItem => {
        const servico = servicos.find(s => String(s.id) === String(item.descricao));
        return {
          descricao: servico ? servico.nome : item.descricao,
          periodicidade: item.periodicidade,
          data: item.dataExecucao ? item.dataExecucao.split("T")[0] : "",
          executadoPor: item.executadoPor,
          //aprovadoPor: item.aprovadoPor,
        };
      });

      setChecklist(checklistFormatado);
    }
  }, [servicos, initialData]);

  useEffect(() => {
    async function fetchSelects() {
      const [amb, srv, tgs] = await Promise.all([
        axios.get("/api/ambientes"),
        axios.get("/api/servicos"),
        axios.get("/api/tags"),
      ]);
      setAmbientes(amb.data);
      setServicos(srv.data);
      setTags(tgs.data);
    }
    fetchSelects();
  }, []);


  useEffect(() => {
    if (initialData && tags.length > 0 && ambientes.length > 0) {
      const ambienteExiste = ambientes.some(a => String(a.id) === String(initialData.ambienteId));
      const tagExiste = tags.some(t => String(t.id) === String(initialData.tagId));

      setFormData({
        nomeAmbiente: initialData.nomeAmbiente || "",
        endereco: initialData.endereco || "",
        numero: initialData.numero || "",
        bairro: initialData.bairro || "",
        cidade: initialData.cidade || "",
        uf: initialData.uf || "",
        cnpj: ambientes.find((a) => String(a.id) === String(initialData.ambienteId))?.cnpj || "",
        cep: ambientes.find((a) => String(a.id) === String(initialData.ambienteId))?.cep || "",
        //telefone: initialData.telefone || "",
        nomeProprietario: initialData.nomeProprietario || "Sicoob Cressem",
        //cgcProprietario: initialData.cgcProprietario || "",
        //enderecoProprietario: initialData.enderecoProprietario || "",
        nomeResponsavel: initialData.nomeResponsavel || "",
        cgcResponsavel: initialData.cgcResponsavel || "",
        conselho: initialData.conselho || "",
        art: initialData.art || "",
        ambienteSelecionado: ambienteExiste ? String(initialData.ambienteId) : "",
        tagSelecionada: tagExiste ? String(initialData.tagId) : "",
        servicoSelecionado: "",
        contrato: "AMG 300525",
      });
    }
  }, [initialData, tags, ambientes]);

  useEffect(() => {
    if (formData.ambienteSelecionado) {
      const ambiente = ambientes.find(
        (amb) => String(amb.id) === String(formData.ambienteSelecionado)
      );
      if (ambiente) {
        setFormData((prev) => ({
          ...prev,
          nomeAmbiente: ambiente.nome,
          cnpj: ambiente.cnpj || "",
          cep: ambiente.cep || "",
        }));
        console.log("Ambiente encontrado:", ambiente);
      }

    }
  }, [formData.ambienteSelecionado, ambientes]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleChecklistChange(index: number, field: keyof ChecklistItem, value: string) {
    const updated = [...checklist];
    updated[index][field] = value;
    setChecklist(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const checklistTransformado = checklist.map((item: ChecklistItem) => {
      const servico = servicos.find(s => s.nome === item.descricao);
      return {
        descricao: item.descricao,
        periodicidade: item.periodicidade,
        data: item.data,
        executadoPor: item.executadoPor,
        //aprovadoPor: item.aprovadoPor,
        servicoId: servico?.id ?? null,
        dataExecucao: item.data ? item.data : undefined,
      };
    });

    onSave({
      ...formData,
      checklist: checklistTransformado,
    });
  }

  function formatarDataBR(data: string): string {
    if (!data) return "";
    const [ano, mes, dia] = data.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  async function handleGeneratePDF() {
    const doc = new jsPDF();
    const ambienteSelecionado = ambientes.find(a => String(a.id) === String(formData.ambienteSelecionado));
    const tagSelecionada = tags.find(t => String(t.id) === String(formData.tagSelecionada));

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

    const linhaNome = `NOME: ${formData.nomeProprietario?.toUpperCase() || ""}`;
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

    const enderecoCompleto = `ENDEREÇO: ${formData.endereco?.toUpperCase() || ""}, Nº: ${formData.numero || ""} / ${formData.cidade?.toUpperCase() || ""} / ${formData.uf?.toUpperCase() || ""} - CEP: ${ambienteSelecionado?.cep || ""}`;
    doc.text(enderecoCompleto, 10, y);
    doc.rect(9, y - 5, 190, 7);
    y += 8; // margem maior para separar

    const cnpj = `CNPJ: ${ambienteSelecionado?.cnpj || ""}`;
    doc.text(cnpj, 10, y);
    doc.rect(9, y - 5, 190, 7); // Borda
    y += 8;

    const contrato = `CONTRATO: ${formData.contrato?.toUpperCase() || ""}`;
    doc.text(contrato, 10, y);
    doc.rect(9, y - 5, 190, 7); // Borda
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("3 - IDENTIFICAÇÃO DO RESPONSÁVEL TÉCNICO:", 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");

    const nomeResp = `NOME: ${formData.nomeResponsavel?.toUpperCase() || ""}`;
    doc.text(nomeResp, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 8;

    const creasp = `CREASP: ${formData.cgcResponsavel?.toUpperCase() || ""}`;
    doc.text(creasp, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 8;

    const conselho = `REGISTRO NO CONSELHO: ${formData.conselho?.toUpperCase() || ""}`;
    doc.text(conselho, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 8;

    const art = `ART: ${formData.art?.toUpperCase() || ""}`;
    doc.text(art, 10, y);
    doc.rect(9, y - 5, 190, 7); y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("5 - PLANO DE MANUTENÇÃO E CONTROLE", 10, y);

    autoTable(doc, {
      startY: y + 2,
      head: [["DESCRIÇÃO", "PERIODICIDADE", "DATA EXECUÇÃO", /*"EXECUTADO POR"*/]],
      body: checklist.map((item: ChecklistItem) => [
        item.descricao?.toLowerCase() || "",
        item.periodicidade?.toUpperCase() || "",
        formatarDataBR(item.data),
        //item.executadoPor?.toUpperCase() || "",
      ]),

      styles: {
        fontSize: 7,
        cellPadding: { top: 3, bottom: 3, right: 3, left: 3 },
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontSize: 8,
        halign: "center",
      },
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

    // Rodapé com data
    doc.setFontSize(8);
    doc.text(`DATA DE GERAÇÃO: ${dataGeracao}`, 105, 290, { align: "center" });


    const nomeArquivo = tagSelecionada
      ? `${tagSelecionada.unidade}-${tagSelecionada.tag}-${dataGeracao}`.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_")
      : `PMOC-${dataGeracao}`;

    doc.save(`${nomeArquivo}.pdf`);

    const blob = doc.output("blob");

    const formDataToSend = new FormData();
    formDataToSend.append("pdf", blob, `${nomeArquivo}.pdf`);
    formDataToSend.append("nomeArquivo", nomeArquivo);
    formDataToSend.append("tagId", formData.tagSelecionada);
    formDataToSend.append("ambienteId", formData.ambienteSelecionado);

    await axios.post("/api/salvar-pdf", formDataToSend);
  }


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("tags:", tags);
  console.log("ambientes:", ambientes);
  console.log("formData.tagSelecionada:", formData.tagSelecionada);
  console.log("formData.ambienteSelecionado:", formData.ambienteSelecionado);

  console.log("TAG selecionada:", formData.tagSelecionada);
  console.log("Tags disponíveis:", tags.map(t => t.id));


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="relative bg-white p-6 rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onCancel} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg font-bold">
          <X size={30} className="cursor-pointer font-semibold" />
        </button>
        <h1 className="text-2xl font-bold mb-6">Editar PMOCs</h1>
        <div id="pmoc-pdf" className="bg-white p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select de Ambiente */}
              <select
                name="ambienteSelecionado"
                value={formData.ambienteSelecionado}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Selecione um Ambiente</option>
                {ambientes.map((amb) => (
                  <option key={amb.id} value={String(amb.id)}>
                    {amb.nome}
                  </option>
                ))}
              </select>

              {/* Select de TAG */}
              <select
                name="tagSelecionada"
                value={formData.tagSelecionada}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Selecione uma TAG</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={String(tag.id)}>
                    {tag.tag} - {tag.unidade} - {tag.local}
                  </option>
                ))}
              </select>

              <input name="endereco" value={formData.endereco} onChange={handleChange} className="border p-2 rounded" placeholder="Endereço" />
              <input name="numero" value={formData.numero} onChange={handleChange} className="border p-2 rounded" placeholder="Número" />
              <input name="bairro" value={formData.bairro} onChange={handleChange} className="border p-2 rounded" placeholder="Bairro" />
              <input name="cidade" value={formData.cidade} onChange={handleChange} className="border p-2 rounded" placeholder="Cidade" />
              <input name="uf" value={formData.uf} onChange={handleChange} className="border p-2 rounded" placeholder="UF" />
              <input name="cnpj" value={formData.cnpj} onChange={handleChange} className="border p-2 rounded" placeholder="CNPJ" />
              <input name="cep" value={formData.cep} onChange={handleChange} className="border p-2 rounded" placeholder="CEP" />
              {/*<input name="telefone" value={formData.telefone} onChange={handleChange} className="border p-2 rounded" placeholder="Telefone" />*/}
              <input name="contrato" value={formData.contrato} onChange={handleChange} className="border p-2 rounded" placeholder="Contrato" />
              <input name="nomeProprietario" value={formData.nomeProprietario} onChange={handleChange} className="border p-2 rounded" placeholder="Nome Proprietário" />
              {/*<input name="cgcProprietario" value={formData.cgcProprietario} onChange={handleChange} className="border p-2 rounded" placeholder="CGC Proprietário" />*/}
              {/*<input name="enderecoProprietario" value={formData.enderecoProprietario} onChange={handleChange} className="border p-2 rounded" placeholder="Endereço Proprietário" />*/}
              <input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} className="border p-2 rounded" placeholder="Nome Responsável" />
              <input name="cgcResponsavel" value={formData.cgcResponsavel} onChange={handleChange} className="border p-2 rounded" placeholder="CGC Responsável" />
              <input name="conselho" value={formData.conselho} onChange={handleChange} className="border p-2 rounded" placeholder="Conselho" />
              <input name="art" value={formData.art} onChange={handleChange} className="border p-2 rounded" placeholder="ART" />
              {/*<select
                name="ambienteSelecionado"
                value={formData.ambienteSelecionado}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Selecione um Ambiente</option>
                {ambientes.map((amb) => (
                  <option key={amb.id} value={String(amb.id)}>
                    {amb.nome}
                  </option>
                ))}
              </select>

              <select
                name="tagSelecionada"
                value={formData.tagSelecionada}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Selecione uma TAG</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={String(tag.id)}>
                    {tag.tag} - {tag.unidade} - {tag.local}
                  </option>
                ))}
              </select>*/}

            </div>

            {checklist.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Checklist</h4>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Descrição</th>
                      <th className="border p-2">Periodicidade</th>
                      <th className="border p-2">Data Execução</th>
                      {/*<th className="border p-2">Executado por</th>*/}
                      {/*<th className="border p-2">Aprovado por</th>*/}
                    </tr>
                  </thead>
                  <tbody>
                    {checklist.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.descricao}</td>
                        <td className="border p-2">
                          <select
                            value={item.periodicidade}
                            onChange={(e) => handleChecklistChange(index, "periodicidade", e.target.value)}
                            className="w-full border rounded px-2"
                          >
                            <option value="">Selecione</option>
                            <option value="Mensal">Mensal</option>
                            <option value="Bimensal">Bimensal</option>
                            <option value="Trimestral">Trimestral</option>
                            <option value="Semestral">Semestral</option>
                          </select>
                        </td>

                        <td className="border p-2">
                          <input type="date" className="w-full border rounded px-2" value={item.data} onChange={(e) => handleChecklistChange(index, "data", e.target.value)} />
                        </td>
                        {/*<td className="border p-2">
                          <input type="text" className="w-full border rounded px-2" value={item.executadoPor} onChange={(e) => handleChecklistChange(index, "executadoPor", e.target.value)} />
                        </td>*/}
                        {/*<td className="border p-2">
                          <input type="text" className="w-full border rounded px-2" value={item.aprovadoPor} onChange={(e) => handleChecklistChange(index, "aprovadoPor", e.target.value)} />
                        </td>*/}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={onCancel} className="border px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointe">Cancelar</button>
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">Salvar</button>
              <button type="button" onClick={handleGeneratePDF} className="bg-green-700 hover:bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:cursor-pointer">Gerar PDF</button>
            </div>
          </form>
        </div >
      </div>
    </div>
  );
}
