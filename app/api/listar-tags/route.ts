import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const ambienteId = req.nextUrl.searchParams.get("ambienteId");

  try {
    const tags = await prisma.tag.findMany({
      where: ambienteId
        ? { ambienteId: Number(ambienteId) }
        : undefined,
      orderBy: { tag: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Erro ao listar TAGs:", error);
    return NextResponse.json({ erro: "Erro ao buscar TAGs." }, { status: 500 });
  }
}
