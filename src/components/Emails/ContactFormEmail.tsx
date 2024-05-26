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
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/public/assets/favicon.png`}
                width="40"
                height="37"
                alt="Glass.no"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>{sender}</strong> har en forespørsel
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">{message}</Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
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

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactFormEmail;
