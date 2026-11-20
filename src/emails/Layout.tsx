import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

export const SITE = "https://www.glass.no";

export const colors = {
	red: "#d93636",
	ink: "#1d1d1f",
	muted: "#5f6368",
	line: "#e6e6e6",
	page: "#f4f4f2",
};

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function Layout({ preview, children }: { preview: string; children: ReactNode }) {
	return (
		<Html lang="nb">
			<Head>
				<meta name="color-scheme" content="light" />
				<meta name="supported-color-schemes" content="light" />
			</Head>
			<Preview>{preview}</Preview>
			<Body style={{ margin: 0, padding: "24px 12px", backgroundColor: colors.page, fontFamily: font, color: colors.ink }}>
				<Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#ffffff", borderTop: `4px solid ${colors.red}` }}>
					<Section style={{ padding: "28px 32px 8px" }}>
						<Link href={SITE}>
							<Img src={`${SITE}/images/logo.png`} width="144" height="40" alt="Glass.no" style={{ display: "block" }} />
						</Link>
					</Section>
					<Section style={{ padding: "8px 32px 32px" }}>{children}</Section>
					<Hr style={{ borderColor: colors.line, margin: 0 }} />
					<Section style={{ padding: "20px 32px" }}>
						<Text style={{ margin: 0, fontSize: 13, lineHeight: "20px", color: colors.muted }}>
							Glass.no ·{" "}
							<Link href={SITE} style={{ color: colors.muted }}>
								www.glass.no
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export function Heading({ children }: { children: ReactNode }) {
	return <Text style={{ margin: "16px 0 12px", fontSize: 24, lineHeight: "30px", fontWeight: 700, letterSpacing: "-0.01em" }}>{children}</Text>;
}

export function Paragraph({ children }: { children: ReactNode }) {
	return <Text style={{ margin: "0 0 14px", fontSize: 16, lineHeight: "24px" }}>{children}</Text>;
}

export function Action({ href, children }: { href: string; children: ReactNode }) {
	return (
		<Section style={{ margin: "20px 0 24px" }}>
			<Link
				href={href}
				style={{ display: "inline-block", padding: "12px 22px", backgroundColor: colors.red, color: "#ffffff", fontSize: 16, fontWeight: 600, textDecoration: "none", borderRadius: 6 }}
			>
				{children}
			</Link>
		</Section>
	);
}

export function Fields({ rows }: { rows: { label: string; value: ReactNode }[] }) {
	return (
		<table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", margin: "8px 0 20px" }}>
			<tbody>
				{rows.map((row) => (
					<tr key={row.label}>
						<td style={{ width: 96, padding: "10px 12px 10px 0", borderBottom: `1px solid ${colors.line}`, fontSize: 14, color: colors.muted, verticalAlign: "top" }}>{row.label}</td>
						<td style={{ padding: "10px 0", borderBottom: `1px solid ${colors.line}`, fontSize: 16, lineHeight: "22px", verticalAlign: "top", wordBreak: "break-word" }}>{row.value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export function Message({ children }: { children: string }) {
	return (
		<Text style={{ margin: "0 0 8px", padding: "16px 18px", backgroundColor: colors.page, borderLeft: `3px solid ${colors.red}`, fontSize: 16, lineHeight: "24px", whiteSpace: "pre-wrap" }}>
			{children}
		</Text>
	);
}

export function Label({ children }: { children: ReactNode }) {
	return <Text style={{ margin: "16px 0 6px", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: colors.muted }}>{children}</Text>;
}
