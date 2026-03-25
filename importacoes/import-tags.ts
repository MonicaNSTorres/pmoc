import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function importarTags() {
    console.log("📥 Lendo arquivo CSV...");

    const filePath = path.join(process.cwd(), "public", "TAGS.csv");
    const results: any[] = [];

    fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" }))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                console.log("🗑️ Apagando equipamentos...");
                await prisma.equipamento.deleteMany();

                console.log("🗑️ Apagando tags...");
                await prisma.tag.deleteMany();

                console.log("⬆️ Importando novas tags...");

                let importadas = 0;

                for (const linha of results) {
                    const nome = linha.NOME?.trim();
                    const unidade = linha.UNIDADE?.trim();
                    const local = linha["LOCAL "]?.trim(); // tem espaço no final
                    const tag = linha["TAG "]?.trim();     // tem espaço no final

                    if (!nome || !unidade || !local || !tag) {
                        console.warn("⚠️ Linha ignorada por falta de dados:", linha);
                        continue;
                    }

                    await prisma.tag.create({
                        data: { nome, unidade, local, tag },
                    });

                    importadas++;
                }

                console.log(`✅ Importação concluída! Total importadas: ${importadas}`);
                process.exit(0);
            } catch (err) {
                console.error("❌ Erro ao importar TAGs:", err);
                process.exit(1);
            }
        });
}

importarTags();
