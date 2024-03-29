import type { FileWithPreview } from '$types';
import type { Handler } from '@netlify/functions';
import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { render } from '@react-email/render';
import ContactFormEmail from '$components/Emails/ContactFormEmail';

const handler: Handler = async (event) => {
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  if (!event.body) {
    return {
      statusCode: 404,
      body: 'Nothing in the request body',
    };
  }
  const body = JSON.parse(event.body);

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
    return {
      statusCode: 200,
      body: `Email sent: ${info.response}`,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Something unexpected happened, please try again later!',
    };
  }
};

export { handler };
