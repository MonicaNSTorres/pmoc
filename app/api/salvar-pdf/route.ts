import path from "path";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("pdf") as File;
  const nomeArquivo = data.get("nomeArquivo") as string;

  if (!file || !nomeArquivo) {
    return NextResponse.json({ error: "Faltam dados" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const agora = new Date();
  const ano = agora.getFullYear().toString();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");

  const folderPath = path.join(process.cwd(), "public", "pdfs", ano, mes);

  const nomeArquivoLimpo = nomeArquivo
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  const filePath = path.join(folderPath, `${nomeArquivoLimpo}.pdf`);

  await mkdir(folderPath, { recursive: true });
  await writeFile(filePath, buffer);

  return NextResponse.json({ success: true, path: filePath });
}