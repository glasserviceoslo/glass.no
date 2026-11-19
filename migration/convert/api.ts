const base = process.env.EMDASH_URL ?? "http://localhost:4330";

let cookie = "";

async function signIn() {
	const response = await fetch(`${base}/_emdash/api/setup/dev-bypass?redirect=/`, { redirect: "manual" });
	cookie = response.headers
		.getSetCookie()
		.map((value) => value.split(";")[0])
		.join("; ");
	if (!cookie) throw new Error(`dev bypass gave no session (${response.status})`);
}

export async function api<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
	if (!cookie) await signIn();
	const response = await fetch(`${base}/_emdash/api${path}`, {
		method: init.method ?? "GET",
		headers: { cookie, "X-EmDash-Request": "1", "content-type": "application/json" },
		body: init.body === undefined ? undefined : JSON.stringify(init.body),
	});
	const json = (await response.json().catch(() => ({}))) as { success?: boolean; data?: T; error?: unknown };
	if (!response.ok || json.success === false) {
		throw new Error(`${init.method ?? "GET"} ${path} → ${response.status} ${JSON.stringify(json.error ?? json).slice(0, 600)}`);
	}
	return json.data as T;
}

export async function listAll<T = any>(path: string): Promise<T[]> {
	const items: T[] = [];
	let cursor: string | undefined;
	do {
		const separator = path.includes("?") ? "&" : "?";
		const page = await api<{ items: T[]; nextCursor?: string }>(
			`${path}${separator}limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
		);
		items.push(...page.items);
		cursor = page.nextCursor;
	} while (cursor);
	return items;
}
