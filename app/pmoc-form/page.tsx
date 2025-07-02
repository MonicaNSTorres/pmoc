"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BackButton from "../components/back-button/back-button";

type ChecklistItem = {
  descricao: string | number;
  periodicidade: string;
  data: string;
  executadoPor: string;
  aprovadoPor: string;
};

export default function PMOCForm() {
  const [ambientes, setAmbientes] = useState<
    {
      id: number;
      nome: string;
      endereco: string;
      numero: string;
      bairro: string;
      cidade: string;
      uf: string;
      //telefone: string;
      cnpj: string;
      cep: string;
    }[]
  >([]);

  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);
  const [tags, setTags] = useState<
    { id: number; tag: string; unidade: string; local: string }[]
  >([]);

  const router = useRouter();
  const [dataAtual, setDataAtual] = useState("");

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    Array.from({ length: 10 }, () => ({
      descricao: "",
      periodicidade: "Mensal",
      data: getTodayISO(),
      executadoPor: "",
      aprovadoPor: "",
    }))
  );

  const [formData, setFormData] = useState({
    nomeAmbiente: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    contrato: "AMG 300525",
    cnpj: "",
    cep: "",
    //telefone: "",
    nomeProprietario: "Sicoob Cressem",
    //cgcProprietario: "",
    //enderecoProprietario: "",
    nomeResponsavel: "LUIZ CARLOS PELLEGRINI JUNIOR",
    cgcResponsavel: "0682189924",
    conselho: "Engenheiro Industrial - Mecânica - RNP 2602139106",
    art: "2620250917094",
    ambienteSelecionado: "",
    servicoSelecionado: "",
    tagSelecionada: "",
  });

  //carrega dados iniciais uma vez
  useEffect(() => {
    async function carregarDados() {
      try {
        const [resAmbientes, resTags, resServicos] = await Promise.all([
          axios.get("/api/listar-ambientes"),
          axios.get("/api/listar-tags"),
          axios.get("/api/listar-servicos"),
        ]);

        setAmbientes(resAmbientes.data);
        setTags(resTags.data);
        setServicos(resServicos.data);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      }
    }

    carregarDados();
  }, []);

  //preenche os campos ao selecionar um ambiente
  useEffect(() => {
    if (!formData.ambienteSelecionado || ambientes.length === 0) return;

    const ambiente = ambientes.find(
      (a) => String(a.id) === formData.ambienteSelecionado
    );

    if (ambiente) {
      setFormData((prev) => ({
        ...prev,
        nomeAmbiente: ambiente.nome,
        endereco: ambiente.endereco || "",
        numero: ambiente.numero || "",
        bairro: ambiente.bairro || "",
        cidade: ambiente.cidade || "",
        uf: ambiente.uf || "",
        cnpj: ambiente.cnpj || "",
        cep: ambiente.cep || "",
      }));
    }
  }, [formData.ambienteSelecionado, ambientes]);



  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleChecklistChange(
    index: number,
    field: keyof ChecklistItem,
    value: string
  ) {
    const updated = [...checklist];
    updated[index][field] = value;
    setChecklist(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post("/api/salvar-pmoc", {
        ...formData,
        checklist,
      });
      alert("PMOC salvo com sucesso!");
      router.push("/pmoc-list");
    } catch (error) {
      console.error("Erro ao salvar PMOC:", error);
      alert("Erro ao salvar o PMOC.");
    }
  }

  useEffect(() => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setDataAtual(dataFormatada);
  }, []);

  function getTodayISO() {
    const hoje = new Date();
    return hoje.toISOString().split("T")[0];
  }


  return (
    <div className="flex flex-col px-4 md:px-[10%] min-h-screen bg-gray-200 p-4">
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <BackButton />
        <div className="flex justify-between items-center mb-2">
          <div></div>{/*espaco vazio para alinhar a direita*/}
          <span className="text-md text-gray-700 font-semibold">{`Data da geração: ${dataAtual}`}</span>
        </div>
        <h2 className="text-sm text-left font-bold mb-10 text-gray-800 md:text-3xl md:text-center">
          Plano de Manutenção, Operação e Controle - PMOC
        </h2>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section>
            <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">1 - Identificação do Ambiente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <select
                name="ambienteSelecionado"
                value={formData.ambienteSelecionado}
                onChange={handleChange}
                className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
              >
                <option value="">Selecione um ambiente</option>
                {ambientes.map((amb) => (
                  <option key={amb.id} value={amb.id}>
                    {amb.nome}
                  </option>
                ))}
              </select>

              <select
                name="tagSelecionada"
                value={formData.tagSelecionada}
                onChange={handleChange}
                className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
              >
                <option value="">Selecione uma TAG</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tag} - {tag.unidade} - {tag.local}
                  </option>
                ))}
              </select>

              <input
                name="contrato"
                placeholder="Contrato"
                value={formData.contrato}
                onChange={handleChange}
                className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
              />

              <input
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleChange}
                readOnly//para nao editarem manualmente
                className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
              />

              <input
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                readOnly
                className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
              />


              {["endereco", "numero", "bairro", "cidade", "uf"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
                />
              ))}

            </div>
          </section>

          {/*<section>
            <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">2 - Identificação do Proprietário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="nomeProprietario" placeholder="Nome/Razão Social" value={formData.nomeProprietario} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
              <input name="cgcProprietario" placeholder="CIC/CGC" value={formData.cgcProprietario} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
              <input name="enderecoProprietario" placeholder="Endereço completo" value={formData.enderecoProprietario} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
            </div>
          </section>*/}

          <section>
            <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">3 - Responsável Técnico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="nomeResponsavel" placeholder="Nome/Razão Social" value={formData.nomeResponsavel} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
              <input name="cgcResponsavel" placeholder="CIC/CGC" value={formData.cgcResponsavel} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
              <input name="conselho" placeholder="Registro no Conselho de Classe" value={formData.conselho} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
              <input name="art" placeholder="ART (Anotação de Responsabilidade Técnica)" value={formData.art} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2" />
            </div>
          </section>

          {/*<section>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">4 - Ambientes Climatizados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <select
                                name="ambienteSelecionado"
                                value={formData.ambienteSelecionado}
                                onChange={handleChange}
                                className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2"
                            >
                                <option value="">Selecione um ambiente</option>
                                {ambientes.map((amb) => (
                                    <option key={amb.id} value={amb.id}>
                                        {amb.nome}
                                    </option>
                                ))}

                            </select>

                            <select name="tagSelecionada" value={formData.tagSelecionada} onChange={handleChange} className="md:col-span-2 w-full max-w-xs md:max-w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none md:text-base md:px-4 md:py-2">
                                <option value="">Selecione uma TAG</option>
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.tag} - {tag.unidade} - {tag.local}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </section>*/}

          <div className="sm:overflow-x-auto md:overflow-auto rounded-lg shadow-md">
            <table className="w-full table-fixed text-xs md:text-sm border-collapse">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="border p-2 w-2/5">Descrição</th>
                  <th className="border p-2 w-1/5">Periodicidade</th>
                  <th className="border p-2 w-1/5">Data Execução</th>
                  <th className="border p-2 w-1/5">Executado por</th>
                  <th className="border p-2 w-1/5">Aprovado por</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((item, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                    <td className="border p-1">
                      <select
                        className="w-full border rounded px-1 py-1 focus:ring-2 focus:ring-blue-400 text-xs"
                        value={item.descricao}
                        onChange={(e) => handleChecklistChange(i, "descricao", e.target.value)}
                      >
                        <option value="">Selecione um serviço</option>
                        {servicos.map((srv) => (
                          <option key={srv.id} value={srv.nome}>
                            {srv.nome}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-1 text-center">{item.periodicidade}</td>
                    <td className="border p-1">
                      <input
                        type="date"
                        className="w-full border rounded px-1 py-1 focus:ring-2 focus:ring-blue-400 text-xs"
                        value={item.data}
                        onChange={(e) => handleChecklistChange(i, "data", e.target.value)}
                      />
                    </td>
                    <td className="border p-1">
                      <input
                        type="text"
                        className="w-full border rounded px-1 py-1 focus:ring-2 focus:ring-blue-400 text-xs"
                        value={item.executadoPor}
                        onChange={(e) => handleChecklistChange(i, "executadoPor", e.target.value)}
                      />
                    </td>
                    <td className="border p-1">
                      <input
                        type="text"
                        className="w-full border rounded px-1 py-1 focus:ring-2 focus:ring-blue-400 text-xs"
                        value={item.aprovadoPor}
                        onChange={(e) => handleChecklistChange(i, "aprovadoPor", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="pt-6 text-center">
            <button type="submit" className="bg-blue-800 hover:bg-blue-600 cursor-pointer text-white font-semibold py-3 px-6 rounded-md transition shadow-md">
              Salvar PMOC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
