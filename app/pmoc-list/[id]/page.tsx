"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function DetalharPMOC() {
  const { id } = useParams();
  const [pmoc, setPmoc] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/api/pmoc-detalhado?id=${id}`);
      setPmoc(res.data);
    }
    if (id) fetchData();
  }, [id]);

  if (!pmoc) return <p className="p-4">Carregando...</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Detalhamento do PMOC #{pmoc.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold">Ambiente</h2>
          <p>{pmoc.nomeAmbiente}</p>
          <p>{pmoc.endereco}, {pmoc.numero} - {pmoc.bairro}</p>
          <p>{pmoc.cidade}/{pmoc.uf} - Tel: {pmoc.telefone}</p>
        </div>

        <div>
          <h2 className="font-semibold">Proprietário</h2>
          <p>{pmoc.nomeProprietario} - {pmoc.cgcProprietario}</p>
          <p>{pmoc.enderecoProprietario}</p>
        </div>

        <div>
          <h2 className="font-semibold">Responsável Técnico</h2>
          <p>{pmoc.nomeResponsavel} - {pmoc.cgcResponsavel}</p>
          <p>Conselho: {pmoc.conselho} | ART: {pmoc.art}</p>
        </div>

        <div>
          <h2 className="font-semibold">Serviço e Ambiente</h2>
          <p>Ambiente: {pmoc.ambiente?.nome}</p>
          <p>Serviço: {pmoc.servico?.nome}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Checklist</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Descrição</th>
              <th className="border p-2">Periodicidade</th>
              <th className="border p-2">Data Execução</th>
              {/*<th className="border p-2">Executado por</th>
              <th className="border p-2">Aprovado por</th>*/}
            </tr>
          </thead>
          <tbody>
            {pmoc.checklist.map((item: any, index: number) => (
              <tr key={index}>
                <td className="border p-2">{item.descricao}</td>
                <td className="border p-2">{item.periodicidade}</td>
                <td className="border p-2">{item.dataExecucao ? new Date(item.dataExecucao).toLocaleDateString() : '-'}</td>
                {/*<td className="border p-2">{item.executadoPor}</td>
                <td className="border p-2">{item.aprovadoPor}</td>*/}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
