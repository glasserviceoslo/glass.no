import { render, toPlainText } from "@react-email/components";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createElement } from "react";
import { Confirmation, confirmationSubject } from "../../emails/Confirmation";
import { Enquiry } from "../../emails/Enquiry";

export const prerender = false;

const INBOX = "post@glass.no";
const SENDER = { email: "skjema@post.glass.no", name: "Glass.no" };

const CONFIRMATIONS_PER_DAY = 200;
const DAY = 24 * 60 * 60;

type EmailBinding = { send(message: { from: typeof SENDER; to: string; replyTo?: string; subject: string; text: string; html: string }): Promise<unknown> };
type Store = { get(key: string): Promise<string | null>; put(key: string, value: string, options: { expirationTtl: number }): Promise<void> };
const FIELDS = ["produkt", "navn", "epost", "telefon", "adresse", "melding"] as const;
const PRODUCTS = ["Vindu", "Dør", "Glass", "Rekkverk", "Glassvegg", "Dusj", "Speil", "Takvindu", "Annet"];
const MAX = { melding: 5000, default: 300 };

const reply = (request: Request, status: number, body: Record<string, unknown>) => {
	if ((request.headers.get("accept") ?? "").includes("application/json")) {
		return Response.json(body, { status });
	}
	const referer = request.headers.get("referer");
	const back = referer && new URL(referer).origin === new URL(request.url).origin ? new URL(referer) : new URL("/", request.url);
	back.searchParams.set("skjema", status < 300 ? "sendt" : "feil");
	return Response.redirect(back.toString(), 303);
};

const verified = async (request: Request, form: FormData) => {
	const secret = (env as { TURNSTILE_SECRET_KEY?: string }).TURNSTILE_SECRET_KEY;
	if (!secret) return true;
	const body = new FormData();
	body.set("secret", secret);
	body.set("response", String(form.get("cf-turnstile-response") ?? ""));
	const ip = request.headers.get("cf-connecting-ip");
	if (ip) body.set("remoteip", ip);
	const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body })
		.then((response) => response.json() as Promise<{ success?: boolean }>)
		.catch(() => ({ success: false }));
	return result.success === true;
};

const oneLine = (text: string) => text.replace(/[\r\n]+/g, " ").trim();

const hash = async (text: string) =>
	[...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text.toLowerCase())))].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const confirm = async (email: EmailBinding, details: Parameters<typeof Confirmation>[0]) => {
	const store = (env as { SESSION?: Store }).SESSION;
	const linked = [details.firstName, details.name, details.phone, details.address, details.message].some((field) => /https?:\/\/|www\.|\b[a-z0-9-]{2,}\.[a-z]{2,}\b/i.test(field));
	if (!store || linked || !(env as { TURNSTILE_SECRET_KEY?: string }).TURNSTILE_SECRET_KEY) return;
	const recipient = `contact-confirmation:to:${await hash(details.email)}`;
	const today = `contact-confirmation:day:${new Date().toISOString().slice(0, 10)}`;
	const [sent, count] = await Promise.all([store.get(recipient), store.get(today)]);
	if (sent || Number(count ?? 0) >= CONFIRMATIONS_PER_DAY) return;
	await Promise.all([store.put(recipient, "1", { expirationTtl: DAY }), store.put(today, String(Number(count ?? 0) + 1), { expirationTtl: 2 * DAY })]);
	const html = await render(createElement(Confirmation, details));
	await email.send({ from: SENDER, to: details.email, replyTo: INBOX, subject: confirmationSubject, text: toPlainText(html), html });
};

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();
	if (String(form.get("nettsted") ?? "").trim()) return reply(request, 200, { ok: true });
	if (!(await verified(request, form))) return reply(request, 403, { error: "challenge" });
	const text = (field: string) => String(form.get(field) ?? "").trim();
	const message = Object.fromEntries(FIELDS.map((field) => [field, text(field)])) as Record<(typeof FIELDS)[number], string>;
	message.navn ||= `${text("fornavn")} ${text("etternavn")}`.trim();
	const phoneOk = /^[+]?[0-9 ]{8,}$/.test(message.telefon);
	const emailOk = /^[^\s@]+@[^\s@]+$/.test(message.epost);
	const missing = [
		...(["navn", "adresse"] as const).filter((field) => !message[field]),
		...(message.telefon && !phoneOk ? ["telefon"] : []),
		...(message.epost && !emailOk ? ["epost"] : []),
		...(!phoneOk && !emailOk ? ["telefon", "epost"] : []),
		...(message.produkt && !PRODUCTS.includes(message.produkt) ? ["produkt"] : []),
	];
	const tooLong = FIELDS.filter((field) => message[field].length > (field === "melding" ? MAX.melding : MAX.default));
	if (missing.length || tooLong.length) {
		return reply(request, 422, { error: "invalid", missing: [...new Set(missing)], tooLong });
	}

	const source = new URL(request.headers.get("referer") ?? request.url).pathname;
	const name = oneLine(message.navn);
	const { EMAIL: email, CONTACT_WEBHOOK_URL: webhook } = env as { EMAIL?: EmailBinding; CONTACT_WEBHOOK_URL?: string };
	if (!email && !webhook) return reply(request, 503, { error: "not-configured" });

	const details = { name, product: message.produkt, email: oneLine(message.epost), phone: oneLine(message.telefon), address: oneLine(message.adresse), message: message.melding };
	const enquiry = await render(createElement(Enquiry, { ...details, page: source }));
	const mailed = email
		? await email
				.send({
					from: SENDER,
					to: INBOX,
					...(details.email ? { replyTo: details.email } : {}),
					subject: details.product && details.product !== "Annet" ? `Ny henvendelse om ${details.product.toLowerCase()} fra ${name}` : `Ny henvendelse fra ${name}`,
					text: [`Navn: ${name}`, `Gjelder: ${details.product || "-"}`, `Telefon: ${details.phone || "-"}`, `E-post: ${details.email || "-"}`, `Adresse: ${details.address}`, `Side: ${source}`, "", message.melding].join("\n"),
					html: enquiry,
				})
				.then(() => true)
				.catch((error: unknown) => {
					console.error("contact form email failed", error);
					return false;
				})
		: undefined;

	if (email && mailed && details.email) {
		await confirm(email, { ...details, firstName: name.split(" ")[0] ?? name }).catch((error: unknown) => console.error("confirmation email failed", error));
	}

	const forwarded = webhook
		? await fetch(webhook, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ ...message, fornavn: name.split(" ")[0] ?? "", etternavn: name.split(" ").slice(1).join(" "), source, receivedAt: new Date().toISOString() }),
			})
				.then((response) => response.ok)
				.catch(() => false)
		: undefined;

	return mailed || forwarded ? reply(request, 200, { ok: true }) : reply(request, 502, { error: "delivery-failed" });
};
