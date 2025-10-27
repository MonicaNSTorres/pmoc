import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { unidade, periodicidade } = await req.json();

  if (!unidade) {
    return NextResponse.json({ error: "Unidade não informada." }, { status: 400 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        nome: {
          equals: unidade,
          mode: "insensitive",
        },
      },
      include: {
        ambiente: true,
      },
    });

    if (!tags.length) {
      return NextResponse.json({ error: "Nenhuma TAG encontrada para essa unidade." }, { status: 404 });
    }

    //servicos divididos por periodicidade
    const servicosPorPeriodicidade: Record<string, string[]> = {
      Mensal: [
        "Verificar e corrigir o ajuste da moldura na estrutura",
        "Verificar obstrução/inclinação para drenagem do condensado na bandeja",
        "Verificar a existência de danos e corrosão no aletado e moldura",
        "Verificar a operação de drenagem de água da bandeja",
        "Limpeza externa",
        "Aplicação de produtos antibactericida na serpentina"
      ],
      Trimestral: [
        "Desincrustar serpentinas, se necessário",
        "Verificar e limpar turbina do ventilador"
      ],
      Semestral: [
        "Verificar danos e corrosão do suporte e existência de frestas",
        "Lavar e remover biofilme da serpentina com produto químico biodegradável"
      ]
    };

    const periodicidadesParaGerar =
      periodicidade === "Todos"
        ? ["Mensal", "Trimestral", "Semestral"]
        : [periodicidade];

    const pmocsCriados: any[] = [];

    //gerar PMOCs e Checklists para cada periodicidade escolhida
    for (const p of periodicidadesParaGerar) {
      const nomesServicos = servicosPorPeriodicidade[p] || [];

      const servicos = await prisma.servico.findMany({
        where: {
          nome: { in: nomesServicos },
        },
      });

      if (!servicos.length) {
        console.warn(`Nenhum serviço encontrado para ${p}.`);
        continue;
      }

      const novosPmocs = await Promise.all(
        tags.map(async (tag) => {
          const ambiente = tag.ambiente;

          const novoPMOC = await prisma.pMOC.create({
            data: {
              nomeAmbiente: ambiente?.nome ?? tag.local ?? "Ambiente sem nome",
              endereco: ambiente?.endereco ?? tag.local ?? "",
              numero: ambiente?.numero ?? "",
              bairro: ambiente?.bairro ?? "",
              cidade: ambiente?.cidade ?? "",
              uf: ambiente?.uf ?? "",
              telefone: ambiente?.telefone ?? "",
              nomeProprietario: "",
              cgcProprietario: "",
              enderecoProprietario: "",
              nomeResponsavel: "LUIZ PELLEGRINI",
              cgcResponsavel: "0682189924",
              conselho: "Engenheiro Industrial - Mecânica - RNP 2602139106",
              art: "2620250917094",
              criadoEm: new Date(),
              tag: { connect: { id: tag.id } },
              ambiente: ambiente?.id ? { connect: { id: ambiente.id } } : undefined,
            },
          });

          const dataExecucaoPadrao = novoPMOC.criadoEm;

          //criar checklists com serviços daquela periodicidade
          await prisma.checklist.createMany({
            data: servicos.map((srv) => ({
              pmocId: novoPMOC.id,
              descricao: srv.nome,
              periodicidade: p,
              servicoId: srv.id,
              dataExecucao: dataExecucaoPadrao,
            })),
          });

          return novoPMOC;
        })
      );

      pmocsCriados.push(...novosPmocs);
    }

    return NextResponse.json({
      message: `PMOCs (${periodicidade}) gerados com sucesso para ${unidade}`,
      count: pmocsCriados.length,
    });
  } catch (error) {
    console.error("Erro ao gerar PMOCs:", error);
    return NextResponse.json({ error: "Erro ao gerar PMOCs." }, { status: 500 });
  }
}
