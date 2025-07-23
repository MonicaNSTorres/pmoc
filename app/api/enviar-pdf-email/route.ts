// pages/api/pmoc/enviar-pdf-email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import axios from "axios";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // se o JSON vier grande
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido" });

  try {
    const { pdf } = req.body;

    if (!pdf || !pdf.url || !pdf.nome) {
      return res.status(400).json({ error: "Dados incompletos do PDF" });
    }

    // Baixa o PDF como buffer
    const response = await axios.get(pdf.url, {
      responseType: "arraybuffer",
    });

    const pdfBuffer = response.data;

    // Configura o transportador (configure com seu provedor real)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,       // ex: "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT), // ex: 465
      secure: true,
      auth: {
        user: process.env.SMTP_USER,     // seu e-mail
        pass: process.env.SMTP_PASS,     // sua senha ou app password
      },
    });

    // Envia o e-mail
    await transporter.sendMail({
      from: `"Sistema PMOC" <${process.env.SMTP_USER}>`,
      to: "destinatario@email.com", // <- você pode trocar por um campo dinâmico
      subject: `PDF PMOC: ${pdf.nome}`,
      text: `Segue o PDF gerado para a TAG "${pdf.tag}" da unidade "${pdf.unidade}" em ${pdf.data}.`,
      attachments: [
        {
          filename: `${pdf.nome}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
}