import type { Handler, HandlerEvent } from '@netlify/functions';
import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';

const handler: Handler = async (event: HandlerEvent) => {
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

  const opts: MailOptions = {
    from: {
      name: body.name,
      address: body.email,
    },
    to: process.env.GLASSNO_EMAIL,
    replyTo: body.email,
    subject: `Kontaktskjema - ${body.name}`,
    text: body.message,
    // attachments: [{
    //   filename:
    // }]
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
