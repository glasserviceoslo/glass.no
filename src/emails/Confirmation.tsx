import { Fields, Heading, Label, Layout, Message, Paragraph } from "./Layout";

export type ConfirmationProps = { firstName: string; name: string; email: string; phone: string; address: string; message: string };

export const confirmationSubject = "Vi har mottatt henvendelsen din";

export function Confirmation({ firstName, name, email, phone, address, message }: ConfirmationProps) {
	return (
		<Layout preview="Takk for at du tok kontakt med Glass.no. Her er en kopi av det du sendte.">
			<Heading>Takk, {firstName}!</Heading>
			<Paragraph>Vi har mottatt henvendelsen din og tar kontakt så snart vi kan.</Paragraph>
			<Paragraph>Vil du legge til noe, kan du svare på denne e-posten.</Paragraph>
			<Label>Dette sendte du</Label>
			<Fields
				rows={[
					{ label: "Navn", value: name },
					{ label: "Telefon", value: phone },
					{ label: "E-post", value: email },
					{ label: "Adresse", value: address },
				]}
			/>
			<Message>{message}</Message>
		</Layout>
	);
}
