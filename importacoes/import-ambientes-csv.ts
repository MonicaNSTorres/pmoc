import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function onlyDigits(value: string) {
  return value?.replace(/\D/g, "") ?? "";
}

function normalizeText(text: string) {
  if (!text) return "";

  return text
    .normalize("NFKD")
    .replace(/\uFFFD/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseEndereco(enderecoCompleto: string) {
  const texto = enderecoCompleto ?? "";

  const endereco = texto.split(",")[0]?.trim() || "";

  const numeroMatch = texto.match(/,\s*(\d+)/);
  const numero = numeroMatch?.[1] || "";

  const cidadeMatch = texto.match(/,\s*([^,]+)\s*-\s*[A-Z]{2}/);
  const cidade = cidadeMatch?.[1]?.trim() || "";

  const ufMatch = texto.match(/-\s*([A-Z]{2})/);
  const uf = ufMatch?.[1] || "";

  const cepMatch = texto.match(/CEP\s*([\d-]+)/i);
  const cep = cepMatch?.[1] || "";

  return {
    endereco: normalizeText(endereco),
    numero,
    cidade: normalizeText(cidade),
    uf,
    cep,
  };
}

async function main() {
  const filePath = path.join(process.cwd(), "AMBIENTES.csv");

  const buffer = fs.readFileSync(filePath);

  const fileContent = iconv.decode(buffer, "win1252");

  const rows = parse(fileContent, {
    columns: true,
    delimiter: ";",
    skip_empty_lines: true,
  });

  for (const row of rows) {
    const nome = normalizeText(row.nome);
    const enderecoRaw = normalizeText(row.local);
    const cnpj = onlyDigits(row.cnpj);

    const { endereco, numero, cidade, uf, cep } =
      parseEndereco(enderecoRaw);

    await prisma.ambiente.upsert({
      where: { nome },
      update: {
        endereco,
        numero,
        cidade,
        uf,
        cep,
        cnpj,
      },
      create: {
        nome,
        endereco,
        numero,
        cidade,
        uf,
        cep,
        cnpj,
      },
    });
  }

  console.log("Ambientes importados com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro ao importar:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });