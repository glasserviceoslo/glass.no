import type { FileWithPreview } from '$types';
import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { render } from '@react-email/render';
import ContactFormEmail from '$components/Emails/ContactFormEmail';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  if (!request.body) {
    return new Response(null, {
      status: 404,
      statusText: 'No body provided',
    });
  }
  const body = await request.json();
  const emailHtml = render(
    ContactFormEmail({
      baseUrl: process.env.URL || 'https://glass.no',
      sender: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
      message: body.message,
    }),
  );

  const attachments = body.upload.map((file: FileWithPreview) => {
    return {
      filename: file.path,
      content: file.base64.split(',')[1],
      encoding: 'base64',
    };
  });

  const opts: MailOptions = {
    from: {
      name: body.name,
      address: body.email,
    },
    to: process.env.GLASSNO_EMAIL,
    bcc: process.env.BCC_EMAIL,
    replyTo: body.email,
    subject: `Kontaktskjema - ${body.name}`,
    html: emailHtml,
    attachments,
  };

  try {
    const info = await transporter.sendMail(opts);
    return new Response(null, {
      status: 200,
      statusText: `Email sent: ${info.response}`,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 500,
      statusText: `Something unexpected happened, please try again later!`,
    });
  }
};
