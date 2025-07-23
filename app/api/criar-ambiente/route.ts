import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, endereco, bairro, cidade, numero, cep, uf } = body;

    if (!nome || nome.trim() === "") {
      return NextResponse.json({ error: "O nome do ambiente é obrigatório." }, { status: 400 });
    }

    const novoAmbiente = await prisma.ambiente.create({
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

    return NextResponse.json(novoAmbiente);
  } catch (error) {
    console.error("Erro ao criar ambiente:", error);
    return NextResponse.json({ error: "Erro interno ao criar ambiente." }, { status: 500 });
  }
}
