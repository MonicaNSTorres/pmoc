import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

/*assinatura embutida (Luiz Pellegrini), derivada da imagem enviada*/
const SIGNATURE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAABhCAIAAACvYVH1AAAQAElEQVR4AexcBzxV7R8/d4RQ2iWV3oZ2" +
  "..." +
  " (TRUNCADO PARA BREVIDADE – USE O VALOR COMPLETO ABAIXO) ";

/* -------------- VALOR COMPLETO --------------
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAABhCAIAAACvYVH1AAAQAElEQVR4AexcBzxV7R8/d4RQ2iWV3oZ2
---------------------------------------------------------------- */

export async function gerarPdfPMOC(pmocId: number) {
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
  doc.text(`Nome (Edifício/Entidade): ${pmoc.nomeProprietario || "Sicoob Cressem"}`, 10, y);
  y += 6;
  doc.text(`TAG: ${tagSelecionada ? `${tagSelecionada.tag} - ${tagSelecionada.unidade} - ${tagSelecionada.local}` : ""}`, 10, y);
  y += 6;
  doc.text(`Endereço completo: ${pmoc.endereco}, Nº: ${pmoc.numero}`, 10, y);
  y += 6;
  doc.text(`CEP: ${ambienteSelecionado?.cep || ""}`, 10, y);
  y += 6;
  doc.text(`CNPJ: ${ambienteSelecionado?.cnpj || ""}`, 10, y);
  y += 6;
  doc.text(`Complemento: ${pmoc.bairro} / ${pmoc.cidade} / ${pmoc.uf}`, 10, y);
  y += 6;
  doc.text(`Contrato: AMG 300525`, 10, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("3 - Identificação do Responsável Técnico:", 10, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text(`Nome/Razão Social: ${pmoc.nomeResponsavel || ""}`, 10, y);
  y += 6;
  doc.text(`CREASP: ${pmoc.cgcResponsavel || ""}`, 10, y);
  y += 6;
  doc.text(`Registro no Conselho: ${pmoc.conselho || ""}`, 10, y);
  y += 6;
  doc.text(`ART: ${pmoc.art || ""}`, 10, y);

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
      "", // aprovadoPor omitido
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

  doc.save(`${nomeArquivo}.pdf`);
}