import type { APIRoute } from 'astro';
import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';

export const post: APIRoute = async ({ request }) => {
  const data = await request.json();

  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: import.meta.env.PROD,
    auth: {
      user: import.meta.env.GMAIL_USER,
      pass: import.meta.env.GMAIL_PASSWORD,
    },
  });

  if (!data) {
    return {
      status: 404,
      body: 'Nothing in the request body',
    };
  }
  console.log('PROD', import.meta.env.PROD);
  console.log(import.meta.env.DEV);
  const opts: MailOptions = {
    from: `"${data.name}"${data.email}`,
    to: import.meta.env.GLASSNO_EMAIL,
    subject: `Kontaktskjema - ${data.name}`,
    text: data.message,
    // attachments: [{
    //   filename:
    // }]
  };

  try {
    const info = await transporter.sendMail(opts);

    return {
      status: 200,
      body: JSON.stringify({
        message: `Email sent: ${info.response}`,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: JSON.stringify({
        message: 'Something unexpected happened, please try again later!',
      }),
    };
  }

  // const body = JSON.parse(request);
};