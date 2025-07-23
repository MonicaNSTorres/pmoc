import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste o caminho se necessário
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  return NextResponse.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    admin: usuario.admin
  });
}