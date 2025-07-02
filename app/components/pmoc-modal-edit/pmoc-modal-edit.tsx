"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { X } from "lucide-react";

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
  aprovadoPor: string;
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
          aprovadoPor: item.aprovadoPor,
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
        aprovadoPor: item.aprovadoPor,
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

  function handleGeneratePDF() {
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

    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Data de Geração: ${dataGeracao}`, 200, y, { align: "right" });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("1 - Identificação do Ambiente ou Conjunto de Ambientes:", 10, y);

    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Nome (Edifício/Entidade): ${formData.nomeProprietario || ""}`, 10, y);
    y += 6;
    doc.text(`TAG: ${tagSelecionada ? `${tagSelecionada.tag} - ${tagSelecionada.unidade} - ${tagSelecionada.local}` : ""}`, 10, y);
    y += 6;
    doc.text(`Endereço completo: ${formData.endereco || ""}, Nº: ${formData.numero || ""}`, 10, y);
    y += 6;
    doc.text(`CEP: ${ambienteSelecionado?.cep || ""}`, 10, y);
    y += 6;
    doc.text(`CNPJ: ${ambienteSelecionado?.cnpj || ""}`, 10, y);
    y += 6;
    doc.text(`Complemento: ${formData.bairro || ""} / ${formData.cidade || ""} / ${formData.uf || ""}`, 10, y);
    //y += 6;
    //doc.text(`Telefone: ${formData.telefone || ""}`, 10, y);
    y += 6;
    doc.text(`Contrato: ${formData.contrato || ""}`, 10, y);


    {/*y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("2 - Identificação do Proprietário, Locatário ou Preposto:", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Nome/Razão Social: ${formData.nomeProprietario || ""}`, 10, y);
    //y += 6;
    //doc.text(`CIC/CGC: ${formData.cgcProprietario || ""}`, 10, y);
    y += 6;
    doc.text(`Endereço completo: ${formData.enderecoProprietario || ""}`, 10, y);*/}

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("3 - Identificação do Responsável Técnico:", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Nome/Razão Social: ${formData.nomeResponsavel || ""}`, 10, y);
    y += 6;
    doc.text(`CREASP: ${formData.cgcResponsavel || ""}`, 10, y);
    y += 6;
    doc.text(`Registro no Conselho: ${formData.conselho || ""}`, 10, y);
    y += 6;
    doc.text(`ART: ${formData.art || ""}`, 10, y);

    /*y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("4 - Relação dos Ambientes Climatizados:", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Ambiente: ${ambienteSelecionado?.nome || ""}`, 10, y);
    y += 6;
    doc.text(`TAG: ${tagSelecionada ? `${tagSelecionada.tag} - ${tagSelecionada.unidade} - ${tagSelecionada.local}` : ""}`, 10, y);
    y += 6;
    doc.setFontSize(8);
    doc.text("NOTA: anexar Projeto de Instalação do sistema de climatização", 10, y);*/

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("5 - Plano de Manutenção e Controle", 10, y);

    // Tabela
    autoTable(doc, {
      startY: y + 2,
      head: [["Descrição", "Periodicidade", "Data Execução", "Executado por", "Aprovado por"]],
      body: checklist.map((item: ChecklistItem) => [
        item.descricao,
        item.periodicidade,
        formatarDataBR(item.data),
        item.executadoPor,
        item.aprovadoPor,
      ]),
      styles: {
        fontSize: 7,
        cellPadding: { top: 3, bottom: 3, right: 3, left: 3 },
      },
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontSize: 8 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "normal");
    //doc.line(20, finalY, 90, finalY);
    doc.line(120, finalY, 190, finalY);
    //doc.text("Técnico Responsável", 30, finalY + 6);
    doc.text("Engenheiro Responsável", 130, finalY + 6);

    doc.save("PMOC-preenchido.pdf");
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
                      <th className="border p-2">Executado por</th>
                      <th className="border p-2">Aprovado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklist.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.descricao}</td>
                        <td className="border p-2">{item.periodicidade}</td>
                        <td className="border p-2">
                          <input type="date" className="w-full border rounded px-2" value={item.data} onChange={(e) => handleChecklistChange(index, "data", e.target.value)} />
                        </td>
                        <td className="border p-2">
                          <input type="text" className="w-full border rounded px-2" value={item.executadoPor} onChange={(e) => handleChecklistChange(index, "executadoPor", e.target.value)} />
                        </td>
                        <td className="border p-2">
                          <input type="text" className="w-full border rounded px-2" value={item.aprovadoPor} onChange={(e) => handleChecklistChange(index, "aprovadoPor", e.target.value)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={onCancel} className="border px-4 py-2 rounded hover:cursor-pointer">Cancelar</button>
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:cursor-pointer">Salvar</button>
              <button type="button" onClick={handleGeneratePDF} className="bg-green-700 text-white px-4 py-2 rounded hover:cursor-pointer">Gerar PDF</button>
            </div>
          </form>
        </div >
      </div>
    </div>
  );
}
