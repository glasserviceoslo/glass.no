import { definePlugin } from "emdash";
import type { PluginContentItem, PluginContext } from "emdash";

const COLLECTION = "google_reviews";
const REVIEWS_URL = "https://mybusiness.googleapis.com/v4/accounts/103147633551444246078/locations/11292797228068896680/reviews";
const SCOPE = "https://www.googleapis.com/auth/business.manage";
const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

type ServiceAccount = { client_email: string; private_key: string; token_uri: string };
type GoogleReview = {
	reviewId: string;
	reviewer?: { displayName?: string; isAnonymous?: boolean };
	starRating?: string;
	comment?: string;
	createTime: string;
	updateTime?: string;
};
type SyncStatus = { at: string; ok: boolean; message: string };

const base64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const encodeJson = (value: unknown) => base64url(new TextEncoder().encode(JSON.stringify(value)));

async function readServiceAccount(): Promise<ServiceAccount | null> {
	let raw: string | undefined;
	try {
		const { env } = await import("cloudflare:workers");
		raw = (env as { GOOGLE_SERVICE_ACCOUNT?: string }).GOOGLE_SERVICE_ACCOUNT;
	} catch {
		raw = undefined;
	}
	raw ??= process.env.GOOGLE_SERVICE_ACCOUNT;
	return raw ? (JSON.parse(raw) as ServiceAccount) : null;
}

async function accessToken(account: ServiceAccount) {
	const now = Math.floor(Date.now() / 1000);
	const unsigned = `${encodeJson({ alg: "RS256", typ: "JWT" })}.${encodeJson({ iss: account.client_email, scope: SCOPE, aud: account.token_uri, iat: now, exp: now + 600 })}`;
	const der = Uint8Array.from(atob(account.private_key.replace(/-----[^-]+-----|\s/g, "")), (char) => char.charCodeAt(0));
	const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
	const signature = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned)));
	const response = await fetch(account.token_uri, {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${base64url(signature)}` }),
	});
	const body = (await response.json()) as { access_token?: string; error_description?: string };
	if (!body.access_token) throw new Error(`Google sign-in failed: ${body.error_description ?? response.status}`);
	return body.access_token;
}

async function fetchReviews(token: string) {
	const reviews: GoogleReview[] = [];
	let pageToken: string | undefined;
	do {
		const url = `${REVIEWS_URL}?pageSize=50${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
		const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
		const body = (await response.json()) as { reviews?: GoogleReview[]; nextPageToken?: string; error?: { message?: string } };
		if (!response.ok) throw new Error(`Google reviews failed: ${body.error?.message ?? response.status}`);
		reviews.push(...(body.reviews ?? []));
		pageToken = body.nextPageToken;
	} while (pageToken);
	return reviews;
}

export function originalComment(comment: string | undefined) {
	if (!comment) return "";
	const original = comment.split("(Original)\n")[1];
	if (original) return original.trim();
	return comment.split("\n\n(Translated by Google)")[0].trim();
}

export function reviewData(review: GoogleReview) {
	return {
		title: review.reviewer?.isAnonymous ? "Google-bruker" : review.reviewer?.displayName?.trim() || "Google-bruker",
		rating: STARS[review.starRating ?? ""] ?? 0,
		comment: originalComment(review.comment),
		reviewed_at: review.createTime,
		google_updated_at: review.updateTime ?? review.createTime,
		google_id: review.reviewId,
	};
}

async function storedReviews(ctx: PluginContext) {
	const items: PluginContentItem[] = [];
	let cursor: string | undefined;
	do {
		const page = await ctx.content!.list(COLLECTION, { limit: 100, cursor });
		items.push(...page.items);
		cursor = page.hasMore ? page.cursor : undefined;
	} while (cursor);
	return new Map(items.map((item) => [String(item.data.google_id), item]));
}

async function publish(ctx: PluginContext, id: string) {
	const current = await ctx.content!.getVersioned!(COLLECTION, id);
	if (current) await ctx.content!.publish!(COLLECTION, id, { _rev: current._rev });
}

export async function importReviews(ctx: PluginContext, reviews: GoogleReview[]) {
	const stored = await storedReviews(ctx);
	let added = 0;
	let changed = 0;
	for (const review of reviews.filter((entry) => STARS[entry.starRating ?? ""])) {
		const data = reviewData(review);
		const existing = stored.get(review.reviewId);
		stored.delete(review.reviewId);
		if (!existing) {
			const created = await ctx.content!.create!(COLLECTION, data);
			await publish(ctx, created.id);
			added++;
		} else if (existing.data.google_updated_at !== data.google_updated_at) {
			await ctx.content!.update!(COLLECTION, existing.id, data);
			if (existing.status === "published") await publish(ctx, existing.id);
			changed++;
		}
	}
	let removed = 0;
	for (const item of stored.values()) {
		await ctx.content!.delete!(COLLECTION, item.id);
		removed++;
	}
	return { added, changed, removed, total: reviews.length };
}

async function sync(ctx: PluginContext): Promise<SyncStatus> {
	const at = new Date().toISOString();
	try {
		const account = await readServiceAccount();
		if (!account) return save(ctx, { at, ok: false, message: "GOOGLE_SERVICE_ACCOUNT er ikke satt" });
		const result = await importReviews(ctx, await fetchReviews(await accessToken(account)));
		return save(ctx, { at, ok: true, message: `${result.total} hos Google: ${result.added} nye, ${result.changed} endret, ${result.removed} fjernet` });
	} catch (error) {
		return save(ctx, { at, ok: false, message: error instanceof Error ? error.message : String(error) });
	}
}

async function save(ctx: PluginContext, status: SyncStatus) {
	await ctx.kv.set("status", status);
	if (status.ok) ctx.log.info(`Google reviews: ${status.message}`);
	else ctx.log.warn(`Google reviews: ${status.message}`);
	return status;
}

export function createPlugin() {
	return definePlugin({
		id: "google-reviews",
		version: "1.0.0",
		capabilities: ["content:read", "content:write", "content:publish"],
		hooks: {
			"plugin:activate": async (_event, ctx) => {
				await ctx.cron!.schedule("sync", { schedule: "15 3 * * *" });
			},
			cron: async (event, ctx) => {
				if (event.name === "sync") await sync(ctx);
			},
		},
		routes: {
			sync: { permission: "plugins:manage", handler: async (ctx) => sync(ctx) },
			status: { permission: "plugins:manage", handler: async (ctx) => (await ctx.kv.get<SyncStatus>("status")) ?? { ok: false, message: "Ikke hentet ennå" } },
		},
	});
}
