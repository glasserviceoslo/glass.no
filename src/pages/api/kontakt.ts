import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

const INBOX = "post@glass.no";
const SENDER = { email: "skjema@glass.no", name: "Glass.no" };

type EmailBinding = { send(message: { from: typeof SENDER; to: string; replyTo: string; subject: string; text: string }): Promise<unknown> };
const FIELDS = ["fornavn", "etternavn", "epost", "telefon", "adresse", "melding"] as const;
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

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();
	if (String(form.get("nettsted") ?? "").trim()) return reply(request, 200, { ok: true });
	if (!(await verified(request, form))) return reply(request, 403, { error: "challenge" });
	const message = Object.fromEntries(FIELDS.map((field) => [field, String(form.get(field) ?? "").trim()]));
	const missing = FIELDS.filter((field) => !message[field] || (field === "telefon" && !/^[+]?[0-9 ]{8,}$/.test(message[field])));
	const tooLong = FIELDS.filter((field) => message[field].length > (field === "melding" ? MAX.melding : MAX.default));
	if (missing.length || tooLong.length || !message.epost.includes("@")) {
		return reply(request, 422, { error: "invalid", missing, tooLong });
	}

	const source = new URL(request.headers.get("referer") ?? request.url).pathname;
	const name = oneLine(`${message.fornavn} ${message.etternavn}`);
	const { EMAIL: email, CONTACT_WEBHOOK_URL: webhook } = env as { EMAIL?: EmailBinding; CONTACT_WEBHOOK_URL?: string };
	if (!email && !webhook) return reply(request, 503, { error: "not-configured" });

	const mailed = email
		? await email
				.send({
					from: SENDER,
					to: INBOX,
					replyTo: oneLine(message.epost),
					subject: `Ny henvendelse fra ${name}`,
					text: [
						`Navn: ${name}`,
						`E-post: ${oneLine(message.epost)}`,
						`Telefon: ${oneLine(message.telefon)}`,
						`Adresse: ${oneLine(message.adresse)}`,
						`Side: ${source}`,
						"",
						message.melding,
					].join("\n"),
				})
				.then(() => true)
				.catch((error: unknown) => {
					console.error("contact form email failed", error);
					return false;
				})
		: undefined;

	const forwarded = webhook
		? await fetch(webhook, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ ...message, source, receivedAt: new Date().toISOString() }),
			})
				.then((response) => response.ok)
				.catch(() => false)
		: undefined;

	return mailed || forwarded ? reply(request, 200, { ok: true }) : reply(request, 502, { error: "delivery-failed" });
};
