import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do ambiente não informado." }, { status: 400 });
    }

    const body = await req.json();
    const { nome, endereco, bairro, cidade, numero, cep, uf } = body;

    if (!nome || nome.trim() === "") {
      return NextResponse.json({ error: "O nome é obrigatório." }, { status: 400 });
    }

    const ambienteAtualizado = await prisma.ambiente.update({
      where: { id: parseInt(id) },
      data: {
        nome: nome.trim(),
        endereco: endereco?.trim() || null,
        bairro: bairro?.trim() || null,
        cidade: cidade?.trim() || null,
        numero: numero?.trim() || null,
        cep: cep?.trim() || null,
        uf: uf?.trim() || null,
      },
    });

    return NextResponse.json(ambienteAtualizado);
  } catch (error) {
    console.error("Erro ao editar ambiente:", error);
    return NextResponse.json({ error: "Erro interno ao editar ambiente." }, { status: 500 });
  }
}
