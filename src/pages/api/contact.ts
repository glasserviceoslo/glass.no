import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { render } from 'jsx-email';
import type { APIRoute } from 'astro';
import type { FileWithPreview } from '../../types';
import { Template as ContactForm } from 'src/components/Emails/ContactFormEmail';

export const POST: APIRoute = async ({ request }) => {
  const transporter = createTransport({
    host: 'send.one.com',
    port: 587,
    secure: false,
    auth: {
      user: import.meta.env.SENDER_EMAIL,
      pass: import.meta.env.SENDER_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  if (!request.body) {
    return new Response(null, {
      status: 404,
      statusText: 'No body provided',
    });
  }
  const body = await request.json();
  const emailHtml = await render(
    ContactForm({
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
      address: import.meta.env.SENDER_EMAIL,
    },
    to: import.meta.env.GLASSNO_EMAIL,
    bcc: import.meta.env.BCC_EMAIL,
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
      statusText: 'Something unexpected happened, please try again later!',
    });
  }
};
