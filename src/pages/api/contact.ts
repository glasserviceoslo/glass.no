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
    secure: true,
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: import.meta.env.GMAIL_USER,
      clientId: import.meta.env.CLIENT_ID,
      clientSecret: import.meta.env.CLIENT_SECRET,
      refreshToken: import.meta.env.GMAIL_REFRESH_TOKEN,
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
      baseUrl: import.meta.env.URL || 'https://glass.no',
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
      statusText: `Something unexpected happened, please try again later!`,
    });
  }
};
