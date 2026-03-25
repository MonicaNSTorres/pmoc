import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.servico.deleteMany();

  await prisma.servico.createMany({
    data: [
      { nome: 'Verificar e corrigir o ajuste da moldura na estrutura' },
      { nome: 'Verificar obstrução/inclinação para drenagem do condensado na bandeja' },
      { nome: 'Verificar a existência de danos e corrosão no aletado e moldura' },
      { nome: 'Verificar a operação de drenagem de água da bandeja' },
      { nome: 'Limpeza externa' },
      { nome: 'Aplicação de produtos antibactericida na serpentina' },
      { nome: 'Desincrustar serpentinas, se necessário' },
      { nome: 'Verificar e limpar turbina do ventilador' },
      { nome: 'Verificar danos e corrosão do suporte e existência de frestas' },
      { nome: 'Lavar e remover biofilme da serpentina com produto químico biodegradável' }
    ],
  });
}

main()
  .then(() => {
    console.log('Dados inseridos com sucesso!');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });