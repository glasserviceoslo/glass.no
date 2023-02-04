import type { APIRoute } from 'astro';
import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';

export const post: APIRoute = async ({ request }) => {
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // if (!request) {
  //   return {
  //     statusCode: 404,
  //     body: 'Nothing in the request body',
  //   };
  // }
  // const body = JSON.parse(request);

  // const opts: MailOptions = {
  //   from: `"${body.name}"${body.email}`,
  //   to: process.env.GLASSNO_EMAIL,
  //   subject: `Kontaktskjema - ${body.name}`,
  //   text: body.message,
  //   // attachments: [{
  //   //   filename:
  //   // }]
  // };

  // try {
  //   const info = await transporter.sendMail(opts);
  //   return {
  //     statusCode: 200,
  //     body: `Email sent: ${info.response}`,
  //   };
  // } catch (error) {
  //   console.error(error);
  //   return {
  //     statusCode: 500,
  //     body: 'Something unexpected happened, please try again later!',
  //   };
  // }
};
