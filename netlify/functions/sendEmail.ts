import type { Handler } from '@netlify/functions';
import { createTransport } from 'nodemailer';

const handler: Handler = async (event, context) => {
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
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

  const opts = {
    from: `"${body.name}"${body.email}`,
    to: process.env.GLASSNO_EMAIL,
    subject: body.subject,
    text: body.message,
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
      body: 'Error',
    };
  }
};

export { handler };
