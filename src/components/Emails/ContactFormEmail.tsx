import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormEmailProps {
  baseUrl: string;
  sender: string;
  phone: string;
  email: string;
  address: string;
  message: string;
}

export const ContactFormEmail = ({
  baseUrl = import.meta.url,
  sender = 'Glass-Service',
  phone,
  email,
  address,
  message,
}: ContactFormEmailProps) => {
  const previewText = `Forespørsel fra ${sender}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="my-auto mx-auto bg-white font-sans">
          <Container className="my-[40px] mx-auto w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <img
                src={`${baseUrl}/public/assets/favicon.png`}
                width="40"
                height="37"
                alt="Glass.no"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="my-[30px] mx-0 p-0 text-center text-[24px] font-normal text-black">
              <strong>{sender}</strong> har en forespørsel
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">{message}</Text>
            <Hr className="my-[26px] mx-0 w-full border border-solid border-[#eaeaea]" />
            <Section>
              <Row>
                <Column align="right">
                  <Text className="text-[14px] leading-[24px] text-black">Navn: </Text>
                </Column>
                <Column align="left">
                  <Text className="text-[14px] leading-[24px] text-black"> {sender}</Text>
                </Column>
              </Row>
              <Row>
                <Column align="right">
                  <Text className="text-[14px] leading-[24px] text-black">E-post: </Text>
                </Column>
                <Column align="left">
                  <Text className="text-[14px] leading-[24px] text-black"> {email}</Text>
                </Column>
              </Row>
              <Row>
                <Column align="right">
                  <Text className="text-[14px] leading-[24px] text-black">Telefon: </Text>
                </Column>
                <Column align="left">
                  <Text className="text-[14px] leading-[24px] text-black"> {phone}</Text>
                </Column>
              </Row>
              <Row>
                <Column align="right">
                  <Text className="text-[14px] leading-[24px] text-black">Addresse: </Text>
                </Column>
                <Column align="left">
                  <Text className="text-[14px] leading-[24px] text-black"> {address}</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="my-[26px] mx-0 w-full border border-solid border-[#eaeaea]" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactFormEmail;
