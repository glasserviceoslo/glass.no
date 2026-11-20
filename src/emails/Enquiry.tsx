import { Link } from "@react-email/components";
import { Action, colors, Fields, Heading, Label, Layout, Message, SITE } from "./Layout";

export type EnquiryProps = { name: string; product: string; email: string; phone: string; address: string; page: string; message: string };

const link = { color: colors.ink };

export function Enquiry({ name, product, email, phone, address, page, message }: EnquiryProps) {
	const tel = `tel:${phone.replace(/\s+/g, "")}`;
	return (
		<Layout preview={message ? message.slice(0, 120) : `${product || "Henvendelse"} · ${address}`}>
			<Heading>Ny henvendelse fra {name}</Heading>
			<Fields
				rows={[
					{ label: "Navn", value: name },
					...(product ? [{ label: "Gjelder", value: product }] : []),
					...(phone ? [{ label: "Telefon", value: <Link href={tel} style={link}>{phone}</Link> }] : []),
					...(email ? [{ label: "E-post", value: <Link href={`mailto:${email}`} style={link}>{email}</Link> }] : []),
					{ label: "Adresse", value: address },
					{ label: "Side", value: <Link href={`${SITE}${page}`} style={link}>{page}</Link> },
				]}
			/>
			{message && (
				<>
					<Label>Melding</Label>
					<Message>{message}</Message>
				</>
			)}
			{phone ? <Action href={tel}>Ring {name}</Action> : <Action href={`mailto:${email}`}>Svar {name}</Action>}
		</Layout>
	);
}
