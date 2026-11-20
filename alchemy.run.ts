import "varlock/auto-load";
import * as Cloudflare from "@alchemy.run/cloudflare";
import * as GCP from "@alchemy.run/gcp";
import * as Alchemy from "alchemy";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { ENV } from "varlock/env";

const live = ENV.LIVE;
const webhook = ENV.CONTACT_WEBHOOK_URL;
const previewEmails = (ENV.PREVIEW_EMAILS ?? "")
	.split(",")
	.map((email) => email.trim())
	.filter(Boolean);

export default Alchemy.Stack(
	"glass-no",
	{
		providers: Layer.mergeAll(Cloudflare.providers(), GCP.providers()),
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
		const imageCache = yield* Cloudflare.R2.Bucket("ImageCache", {
			name: "glass-no-image-cache",
			jurisdiction: "eu",
			lifecycleRules: [{ id: "expire-old-versions", deleteObjectsTransition: { condition: { type: "Age", maxAge: 180 * 24 * 60 * 60 } } }],
		});
		const sessions = yield* Cloudflare.KV.Namespace("Sessions", { title: "glass-no-sessions" });
		const turnstile = yield* Cloudflare.Turnstile.Widget("ContactForm", {
			name: "glass-no-contact",
			domains: ["glass.no"],
			mode: "managed",
		});

		const encryptionSeed = yield* Alchemy.Random("EncryptionKey");
		const encryptionKey = Output.map(encryptionSeed.text, (hex) =>
			Redacted.make(`emdash_enc_v1_${Buffer.from(Redacted.value(hex), "hex").toString("base64url")}`),
		);

		const google = yield* GCP.ResourceManager.Project("Google", { projectId: "glass-no-reviews", displayName: "Glass.no reviews" });
		yield* GCP.ServiceUsage.ProjectService("BusinessProfileApi", { project: google.projectId, service: "mybusiness.googleapis.com" });
		const iamApi = yield* GCP.ServiceUsage.ProjectService("IamApi", { project: google.projectId, service: "iam.googleapis.com" });
		const reviewer = yield* GCP.IAM.ServiceAccount("ReviewSync", {
			project: iamApi.project,
			accountId: "review-sync",
			displayName: "Google review sync for glass.no",
		});
		const reviewerKey = yield* GCP.IAM.ServiceAccountKey("ReviewSyncKey", { serviceAccount: reviewer.email });
		const googleAccount = Output.map(Output.all(reviewerKey.serviceAccount, reviewerKey.privateKey), ([email, key]) =>
			Redacted.make(JSON.stringify({ client_email: email, private_key: Redacted.value(key), token_uri: "https://oauth2.googleapis.com/token" })),
		);

		const site = yield* Cloudflare.Worker("Site", {
			name: "glass-no",
			main: "./dist/server/entry.mjs",
			bundle: false,
			assets: "./dist/client",
			compatibility: { date: "2026-02-24", flags: ["nodejs_compat"] },
			crons: ["* * * * *"],
			cache: { enabled: true },
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
				IMAGE_CACHE: imageCache,
				SESSION: sessions,
				IMAGES: Cloudflare.Images.Images("Images"),
				EMAIL: Cloudflare.Email.SendEmail("Email", { allowedSenderAddresses: ["skjema@post.glass.no"] }),
				TURNSTILE_SITE_KEY: turnstile.sitekey,
				TURNSTILE_SECRET_KEY: turnstile.secret,
				EMDASH_ENCRYPTION_KEY: encryptionKey,
				...(webhook ? { CONTACT_WEBHOOK_URL: Redacted.make(webhook) } : {}),
				GOOGLE_SERVICE_ACCOUNT: googleAccount,
			},
		});

		return { url: site.url, googleProject: google.name, reviewSyncAccount: reviewer.email };
	}),
);
