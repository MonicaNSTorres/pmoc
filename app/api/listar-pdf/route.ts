import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dirPath = path.resolve("./public/pdfs");
    const unidades = await fs.readdir(dirPath);

    const arquivos: any[] = [];

    for (const unidade of unidades) {
      const unidadePath = path.join(dirPath, unidade);

      const statUnidade = await fs.stat(unidadePath);
      if (!statUnidade.isDirectory()) continue;

      const tags = await fs.readdir(unidadePath);
      for (const tag of tags) {
        const tagPath = path.join(unidadePath, tag);

        const statTag = await fs.stat(tagPath);
        if (!statTag.isDirectory()) continue;

        const files = await fs.readdir(tagPath);
        for (const file of files) {
          arquivos.push({
            nome: file,
            url: `/pdfs/${unidade}/${tag}/${file}`,
            unidade,
            tag,
            data: extrairDataDoNome(file),
          });
        }
      }
    }

    return NextResponse.json(arquivos);
  } catch (error) {
    console.error("Erro ao listar PDFs:", error);
    return NextResponse.json({ erro: "Erro ao listar PDFs" }, { status: 500 });
  }
}

function extrairDataDoNome(nome: string): string {
  try {
    // Ex: "UnidadeA-TAG1-24/06/2025.pdf" → ["UnidadeA", "TAG1", "24/06/2025"]
    const partes = nome.replace(".pdf", "").split("-");
    const data = partes[2] ?? "";
    return data;
  } catch {
    return "";
  }
}