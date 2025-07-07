import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const pdf = formData.get("pdf") as File;
    const unidade = formData.get("unidade") as string;
    const tag = formData.get("tag") as string;

    if (!pdf || !unidade || !tag) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const bytes = await pdf.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const nomeArquivo = pdf.name;

    const pastaDestino = path.join(process.cwd(), "public", "pdfs", unidade, tag);

    //cria a pasta se ela nao existir
    await mkdir(pastaDestino, { recursive: true });

    //caminho completo para salvar o PDF
    const caminhoArquivo = path.join(pastaDestino, nomeArquivo);

    //salva o PDF no disco
    await writeFile(caminhoArquivo, buffer);

    return NextResponse.json({ sucesso: true, caminho: `/pdfs/${unidade}/${tag}/${nomeArquivo}` });
  } catch (error: any) {
    console.error("Erro ao salvar PDF:", error);
    return NextResponse.json({ error: "Erro interno ao salvar o PDF." }, { status: 500 });
  }
}