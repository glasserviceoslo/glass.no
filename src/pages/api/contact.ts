export const prerender = false;
import { createTransport } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { render } from 'jsx-email';
import type { APIRoute } from 'astro';
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

  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const address = data.get('address');
  const phone = data.get('phone');
  const message = data.get('message');

  if (!name || !email || !message || !address || !phone) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  let attachments = [];

  // Handle file uploads from DropzoneField
  // Check for upload_count which indicates individual file uploads
  const uploadCountStr = data.get('upload_count');
  let fileCount = 0;

  if (uploadCountStr && typeof uploadCountStr === 'string') {
    fileCount = parseInt(uploadCountStr, 10);
  }

  if (fileCount > 0) {
    console.log(`Processing ${fileCount} uploaded files`);

    // Process each individually uploaded file
    for (let i = 0; i < fileCount; i++) {
      const file = data.get(`upload_${i}`);

      if (file instanceof File) {
        try {
          // Process the file directly
          const buffer = await file.arrayBuffer();
          const base64Data = Buffer.from(buffer).toString('base64');

          attachments.push({
            filename: file.name || `file_${i}.dat`,
            content: base64Data,
            encoding: 'base64',
          });
        } catch (error) {
          console.error(`Error processing file ${i}:`, error);
        }
      }
    }
  } else {
    // Handle the legacy pattern or direct file upload
    // This is a fallback for compatibility
    const upload = data.get('upload');

    if (upload) {
      console.log('Processing upload data (fallback method)');

      if (upload instanceof File) {
        // Handle single file
        try {
          const buffer = await upload.arrayBuffer();
          const base64Data = Buffer.from(buffer).toString('base64');

          attachments.push({
            filename: upload.name || 'file.dat',
            content: base64Data,
            encoding: 'base64',
          });
        } catch (error) {
          console.error('Error processing file:', error);
        }
      } else if (typeof upload === 'string') {
        // Attempt to handle string input, which might be "[object File],[object File]"
        // This is likely not JSON, so don't try to parse it
        console.log('Upload is a string but not JSON (expected File objects)');
      }
    }

    // Also check for multiple files with the same key
    const allUploads = data.getAll('upload');
    if (allUploads.length > 1) {
      console.log(`Found ${allUploads.length} files with the same key`);

      for (const item of allUploads) {
        if (item instanceof File) {
          try {
            const buffer = await item.arrayBuffer();
            const base64Data = Buffer.from(buffer).toString('base64');

            attachments.push({
              filename: item.name || 'file.dat',
              content: base64Data,
              encoding: 'base64',
            });
          } catch (error) {
            console.error('Error processing file from multiple uploads:', error);
          }
        }
      }
    }
  }

  const emailHtml = await render(
    ContactForm({
      sender: name.toString(),
      address: address.toString(),
      email: email.toString(),
      phone: phone.toString(),
      message: message.toString(),
    }),
  );

  const opts: MailOptions = {
    from: {
      name: name.toString(),
      address: import.meta.env.SENDER_EMAIL,
    },
    to: import.meta.env.GLASSNO_EMAIL,
    bcc: import.meta.env.BCC_EMAIL,
    replyTo: email.toString(),
    subject: `Kontaktskjema - ${name.toString()}`,
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
