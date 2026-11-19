import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

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

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();
	const message = Object.fromEntries(FIELDS.map((field) => [field, String(form.get(field) ?? "").trim()]));
	const missing = FIELDS.filter((field) => !message[field] || (field === "telefon" && message[field] === "+47"));
	const tooLong = FIELDS.filter((field) => message[field].length > (field === "melding" ? MAX.melding : MAX.default));
	if (missing.length || tooLong.length || !message.epost.includes("@")) {
		return reply(request, 422, { error: "invalid", missing, tooLong });
	}

	const webhook = (env as { CONTACT_WEBHOOK_URL?: string }).CONTACT_WEBHOOK_URL;
	if (!webhook) return reply(request, 503, { error: "not-configured" });

	const forwarded = await fetch(webhook, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ ...message, source: new URL(request.headers.get("referer") ?? request.url).pathname, receivedAt: new Date().toISOString() }),
	}).catch(() => undefined);

	return forwarded?.ok ? reply(request, 200, { ok: true }) : reply(request, 502, { error: "forward-failed" });
};
