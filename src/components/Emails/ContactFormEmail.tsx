import { Body, Container, Head, Hr, Html, Img, Preview, Section, Text, Tailwind, Heading } from 'jsx-email';

export const TemplateName = 'ContactFormEmail';

interface TemplateProps {
  sender: string;
  phone: string;
  email: string;
  address: string;
  message: string;
}

const baseUrl = import.meta.env.DEV ? '../../../public/assets' : `${import.meta.url}/public/assets`;

export const Template = ({ email, address, message, phone, sender }: TemplateProps) => (
  <Html>
    <Head />
    <Preview>{`Forespørsel fra ${sender}`}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] max-w-[600px] rounded border border-solid border-[#eaeaea] p-[30px]">
          {/* Header with logo and name */}
          <Section className="mb-[32px] flex items-center justify-center">
            <Img src={`${baseUrl}/favicon.png`} width="40" height="60" alt="Glass.no" />
            <Text className="ml-3 text-2xl font-medium">glass.no</Text>
          </Section>

          {/* Title */}
          <Heading className="mx-0 mb-[30px] mt-[20px] p-0 text-center text-[24px] font-bold text-black">
            Ny forespørsel fra {sender}
          </Heading>

          {/* Message section */}
          <Section className="mb-[26px] rounded bg-gray-50 p-[20px]">
            <Text className="text-[16px] leading-[26px] text-black">{message}</Text>
          </Section>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

          {/* Contact information */}
          <Section className="mb-[26px]">
            <Heading className="mb-[20px] text-[18px] font-semibold text-black">Kontaktinformasjon</Heading>

            <table className="w-full" cellPadding="0" cellSpacing="0">
              <tbody>
                {/* Name row */}
                <tr>
                  <td className="py-1 pr-4 text-right align-top" width="120">
                    <Text className="m-0 text-[14px] font-semibold leading-[24px] text-gray-500">Navn:</Text>
                  </td>
                  <td className="py-1 pl-4 align-top">
                    <Text className="m-0 text-[14px] leading-[24px] text-black">{sender}</Text>
                  </td>
                </tr>

                {/* Email row */}
                <tr>
                  <td className="py-1 pr-4 text-right align-top" width="120">
                    <Text className="m-0 text-[14px] font-semibold leading-[24px] text-gray-500">E-post:</Text>
                  </td>
                  <td className="py-1 pl-4 align-top">
                    <Text className="m-0 text-[14px] leading-[24px] text-black">{email}</Text>
                  </td>
                </tr>

                {/* Phone row */}
                <tr>
                  <td className="py-1 pr-4 text-right align-top" width="120">
                    <Text className="m-0 text-[14px] font-semibold leading-[24px] text-gray-500">Telefon:</Text>
                  </td>
                  <td className="py-1 pl-4 align-top">
                    <Text className="m-0 text-[14px] leading-[24px] text-black">{phone}</Text>
                  </td>
                </tr>

                {/* Address row */}
                <tr>
                  <td className="py-1 pr-4 text-right align-top" width="120">
                    <Text className="m-0 text-[14px] font-semibold leading-[24px] text-gray-500">Adresse:</Text>
                  </td>
                  <td className="py-1 pl-4 align-top">
                    <Text className="m-0 text-[14px] leading-[24px] text-black">{address}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

          {/* Footer */}
          <Section>
            <Text className="text-center text-[12px] leading-[24px] text-gray-400">
              Denne e-posten ble sendt via kontaktskjemaet på glass.no
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
