import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("pdf") as File | null;
    const nome = formData.get("nome")?.toString();
    const tag = formData.get("tag")?.toString();
    const unidade = formData.get("unidade")?.toString();
    const data = formData.get("data")?.toString();

    if (!file || !nome || !tag || !unidade || !data) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Sistema PMOC" <${process.env.SMTP_USER}>`,
      to: "destinatario@email.com",
      subject: `PDF PMOC: ${nome}`,
      text: `Segue o PDF gerado para a TAG "${tag}" da unidade "${unidade}" em ${data}.`,
      attachments: [
        {
          filename: `${nome}.pdf`,
          content: buffer,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return NextResponse.json({ error: "Erro interno ao enviar e-mail" }, { status: 500 });
  }
}
