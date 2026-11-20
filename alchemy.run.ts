import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";

const live = process.env.LIVE === "true";
const webhook = process.env.CONTACT_WEBHOOK_URL;
const previewEmails = (process.env.PREVIEW_EMAILS ?? "")
	.split(",")
	.map((email) => email.trim())
	.filter(Boolean);

export default Alchemy.Stack(
	"glass-no",
	{
		providers: Cloudflare.providers(),
		state: Cloudflare.state({ workerName: "glass-no-state" }),
	},
	Effect.gen(function* () {
		const database = yield* Cloudflare.D1.Database("Database", {
			name: "glass-no",
			jurisdiction: "eu",
		});
		const media = yield* Cloudflare.R2.Bucket("Media", {
			name: "glass-no-media",
			jurisdiction: "eu",
		});
		const sessions = yield* Cloudflare.KV.Namespace("Sessions", { title: "glass-no-sessions" });
		const turnstile = yield* Cloudflare.Turnstile.Widget("ContactForm", {
			name: "glass-no-contact",
			domains: ["glass.no"],
			mode: "managed",
		});

		const site = yield* Cloudflare.Worker("Site", {
			name: "glass-no",
			main: "./dist/server/entry.mjs",
			bundle: false,
			assets: "./dist/client",
			compatibility: { date: "2026-02-24", flags: ["nodejs_compat"] },
			crons: ["* * * * *"],
			domain: live ? { name: "www.glass.no", redirects: ["glass.no", "ny.glass.no"] } : "ny.glass.no",
			workersDev: false,
			access: live
				? undefined
				: {
						name: "glass-no-preview",
						sessionDuration: "168h",
						policies: [
							{
								decision: "allow",
								include: [{ emailDomain: "glass.no" }, ...previewEmails.map((email) => ({ email }))],
							},
						],
					},
			env: {
				DB: database,
				MEDIA: media,
				SESSION: sessions,
				IMAGES: Cloudflare.Images.Images("Images"),
				EMAIL: Cloudflare.Email.SendEmail("Email", { allowedSenderAddresses: ["skjema@glass.no"] }),
				TURNSTILE_SITE_KEY: turnstile.sitekey,
				TURNSTILE_SECRET_KEY: turnstile.secret,
				...(webhook ? { CONTACT_WEBHOOK_URL: Redacted.make(webhook) } : {}),
			},
		});

		return { url: site.url };
	}),
);
