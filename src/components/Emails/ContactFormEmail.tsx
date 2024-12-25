import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Column,
  Row,
  Heading,
} from 'jsx-email';

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
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px] flex justify-center">
            <Column>
              <Img className="mr-4" src={`${baseUrl}/favicon.png`} width="40" height="60" alt="Glass.no" />
            </Column>
            <Column>
              <p className="text-2xl font-medium">glass.no</p>
            </Column>
          </Section>
          <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black text-wrap">
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
