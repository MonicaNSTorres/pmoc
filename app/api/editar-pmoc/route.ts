import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  const data = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const ambiente = await prisma.ambiente.findUnique({
      where: { id: Number(data.ambienteSelecionado) },
    });

    let tag = null;

    if (data.tagSelecionada && !isNaN(Number(data.tagSelecionada))) {
      tag = await prisma.tag.findUnique({
        where: { id: Number(data.tagSelecionada) },
      });
    }


    const tagId = data.tagSelecionada && !isNaN(Number(data.tagSelecionada))
      ? Number(data.tagSelecionada)
      : null;

    const pmocAtualizado = await prisma.pMOC.update({
      where: { id },
      data: {
        nomeAmbiente: data.nomeAmbiente,
        endereco: data.endereco,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        //telefone: data.telefone,
        nomeProprietario: data.nomeProprietario,
        cgcProprietario: data.cgcProprietario,
        enderecoProprietario: data.enderecoProprietario,
        nomeResponsavel: data.nomeResponsavel,
        cgcResponsavel: data.cgcResponsavel,
        conselho: data.conselho,
        art: data.art,
        ambienteId: data.ambienteSelecionado ? Number(data.ambienteSelecionado) : null,
        tagId: tag ? tag.id : null,
      },
    });


    if (Array.isArray(data.checklist)) {
      await prisma.checklist.deleteMany({
        where: { pmocId: id },
      });

      await prisma.checklist.createMany({
        data: data.checklist.map((item: any) => ({
          descricao: item.descricao,
          periodicidade: item.periodicidade,
          dataExecucao: item.data ? new Date(`${item.data}T00:00:00`) : null,
          executadoPor: item.executadoPor,
          //aprovadoPor: item.aprovadoPor,
          pmocId: id,
        })),
      });
    }

    return NextResponse.json({ success: true, pmoc: pmocAtualizado });
  } catch (error) {
    console.error("Erro ao editar PMOC:", error);
    return NextResponse.json({ error: "Erro ao editar PMOC" }, { status: 500 });
  }
}
