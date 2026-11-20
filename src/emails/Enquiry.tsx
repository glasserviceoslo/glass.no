import { Link } from "@react-email/components";
import { Action, colors, Fields, Heading, Label, Layout, Message, SITE } from "./Layout";

export type EnquiryProps = { name: string; email: string; phone: string; address: string; page: string; message: string };

const link = { color: colors.ink };

export function Enquiry({ name, email, phone, address, page, message }: EnquiryProps) {
	return (
		<Layout preview={message.slice(0, 120)}>
			<Heading>Ny henvendelse fra {name}</Heading>
			<Fields
				rows={[
					{ label: "Navn", value: name },
					{ label: "Telefon", value: <Link href={`tel:${phone.replace(/\s+/g, "")}`} style={link}>{phone}</Link> },
					{ label: "E-post", value: <Link href={`mailto:${email}`} style={link}>{email}</Link> },
					{ label: "Adresse", value: address },
					{ label: "Side", value: <Link href={`${SITE}${page}`} style={link}>{page}</Link> },
				]}
			/>
			<Label>Melding</Label>
			<Message>{message}</Message>
			<Action href={`tel:${phone.replace(/\s+/g, "")}`}>Ring {name}</Action>
		</Layout>
	);
}
