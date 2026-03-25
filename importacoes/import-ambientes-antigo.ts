import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ambientes = [
  { nome: "GARAGEM", local: "SALA TI/CPD/CFTV" },
  { nome: "SEDE PISO TÉRREO", local: "HALL ELEVADOR" },
  { nome: "SEDE PISO TÉRREO", local: "CX ELETRÔNICO" },
  { nome: "SEDE PISO TÉRREO", local: "RECEPÇÃO" },
  { nome: "SEDE PISO TÉRREO", local: "ESPERA" },
  { nome: "SEDE PISO TÉRREO", local: "ATENDIMENTO" },
  { nome: "SEDE PISO TÉRREO", local: "GERENCIA ATENDIMENTO" },
  { nome: "SEDE PISO TÉRREO", local: "AGÊNCIA" },
  { nome: "SEDE PISO TÉRREO", local: "TESOURARIA" },
  { nome: "SEDE PISO TÉRREO", local: "LOUNGE CAFE" },
  { nome: "SEDE PISO TÉRREO", local: "ATENDIMENTO SEGURO" },
  { nome: "SEDE PISO TÉRREO", local: "CORREDOR E ENTRADA" },
  { nome: "SEDE PISO TÉRREO", local: "ANÁLISE TECNICA" },
  { nome: "SEDE PISO TÉRREO", local: "COPA" },
  { nome: "SEDE PISO TÉRREO", local: "GUARITA" },
  { nome: "SEDE PISO TÉRREO", local: "SALA DO NOBREAK" },
  { nome: "SEDE PISO SUPERIOR", local: "HALL ELEVADOR" },
  { nome: "SEDE PISO SUPERIOR", local: "CORREDOR E ENTRADA" },
  { nome: "SEDE PISO SUPERIOR", local: "REUNIÃO" },
  { nome: "SEDE PISO SUPERIOR", local: "CONSELHO" },
  { nome: "SEDE PISO SUPERIOR", local: "PRESIDÊNCIA CONSELHO" },
  { nome: "SEDE PISO SUPERIOR", local: "RECEPÇÃO" },
  { nome: "SEDE PISO SUPERIOR", local: "LOUNGE ESPERA" },
  { nome: "SEDE PISO SUPERIOR", local: "DIRETORIA OPERACIONAL" },
  { nome: "SEDE PISO SUPERIOR", local: "ASSESSORIA PRESIDÊNCIA" },
  { nome: "SEDE PISO SUPERIOR", local: "DIRETOR PRESIDENTE" },
  { nome: "SEDE PISO SUPERIOR", local: "AUDITÓRIO" },
  { nome: "ANEXO PISO TÉRREO", local: "SALA ADMINISTRAÇÃO" },
  { nome: "ANEXO PISO TÉRREO", local: "SALA ALMOXARIFADO" },
  { nome: "ANEXO PISO TÉRREO", local: "SALA TECNO INFO" },
  { nome: "ANEXO PISO SUPERIOR", local: "REFEITÓRIO" },
  { nome: "ANEXO PISO SUPERIOR", local: "REFEITÓRIO / DESCOMPRESSÃO" },
  { nome: "CENTRO DE CONVIVENCIA PISO TÉRREO", local: "GUARITA" },
  { nome: "CENTRO DE CONVIVENCIA PISO TÉRREO", local: "RECEPÇÃO" },
  { nome: "CENTRO DE CONVIVENCIA PISO TÉRREO", local: "AUDITÓRIO" },
  { nome: "CENTRO DE CONVIVENCIA PISO TÉRREO", local: "GERENCIA ATENDIMENTO PJ" },
  { nome: "CENTRO DE CONVIVENCIA PISO TÉRREO", local: "SALA DE COSTURA" },
  { nome: "CENTRO DE CONVIVENCIA PISO TÉRREO", local: "COPA/COZINHA" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "RECEPÇÃO/SALA CONSELHO" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "SALA ADMINISTRAÇÃO" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "SALA PODCAST" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "SALA TREINAMENTO" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "SALA PESSOAL CALLCENTER" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "SALA TI/CPD/CFTV" },
  { nome: "CENTRO DE CONVIVENCIA PISO SUPERIOR", local: "ANFITEATRO E DANÇA" },
  { nome: "AG SUL", local: "SALA TI/CPD/CFTV" },
  { nome: "AG SUL", local: "ATENDIMENTO" },
  { nome: "PA SUL", local: "ATENDIMENTO" },
  { nome: "AG JAMBEIRO", local: "ATENDIMENTO" },
  { nome: "AG JAMBEIRO", local: "COPA" },
  { nome: "AG JAMBEIRO", local: "SALA TI/CFTV/NOBREAK" },
  { nome: "AG PARAIBUNA CEDRAP", local: "ATENDIMENTO" },
  { nome: "AG PARAIBUNA CEDRAP", local: "ATM" },
  { nome: "AG PARAIBUNA CEDRAP", local: "SALA TI/CFTV/NOBREAK" },
  { nome: "PA PARAIBUNA CENTRO", local: "ATENDIMENTO" },
  { nome: "PA CAÇAPAVA", local: "ATENDIMENTO" },
  { nome: "PA CAMPOS DE JORDÃO", local: "ATENDIMENTO" },
  { nome: "PA CARAGUÁ", local: "ATENDIMENTO" },
  { nome: "PA CRUZEIRO", local: "ATENDIMENTO" },
  { nome: "PA EUGENIO DE MELO", local: "ATENDIMENTO" },
  { nome: "PA ILHA BELA", local: "ATENDIMENTO" },
  { nome: "PA JACAREÍ", local: "ATENDIMENTO ESPERA" },
  { nome: "PA JACAREÍ", local: "ATENDIMENTO" },
  { nome: "PA ORIENTE", local: "ATENDIMENTO" },
  { nome: "PA SÃO SEBASTIÃO", local: "ATENDIMENTO" },
  { nome: "PA SFX", local: "ATENDIMENTO" },
  { nome: "PA SFX", local: "ATENDIMENTO SEBRAE" },
  { nome: "PA TAUBATÉ", local: "ATENDIMENTO" },
  { nome: "PA UBATUBA", local: "ATENDIMENTO" },
];

  //exclui todos os registros existentes
  await prisma.ambiente.deleteMany();

  //insere os novos ambientes
  for (const ambiente of ambientes) {
    await prisma.ambiente.create({ data: ambiente });
  }

  console.log("Ambientes substituídos com sucesso.");
}

main()
  .catch((e) => console.error("Erro ao importar ambientes:", e))
  .finally(() => prisma.$disconnect());
