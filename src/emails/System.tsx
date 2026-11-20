import { Action, Heading, Layout, Paragraph } from "./Layout";

export type SystemProps = { heading: string; paragraphs: string[]; action?: { href: string; label: string } };

export function System({ heading, paragraphs, action }: SystemProps) {
	const [first, ...rest] = paragraphs;
	return (
		<Layout preview={first ?? heading}>
			<Heading>{heading}</Heading>
			{first && <Paragraph>{first}</Paragraph>}
			{action && <Action href={action.href}>{action.label}</Action>}
			{rest.map((paragraph) => (
				<Paragraph key={paragraph}>{paragraph}</Paragraph>
			))}
		</Layout>
	);
}
