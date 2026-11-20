import { api, listAll } from "./api.ts";
import { syncSchema } from "./sync-schema.ts";

await syncSchema();
for (const collection of ["pages", "posts"]) {
	const entries = await listAll<{ id: string; status: string; data: { layout?: unknown } }>(`/content/${collection}`);
	let count = 0;
	for (const entry of entries) {
		const { item } = await api<{ item: { data: { layout?: unknown } } }>(`/content/${collection}/${entry.id}`);
		if (!item.data.layout) continue;
		await api(`/content/${collection}/${entry.id}`, { method: "PUT", body: { data: { layout: item.data.layout }, skipRevision: true } });
		if (entry.status === "published") await api(`/content/${collection}/${entry.id}/publish`, { method: "POST", body: {} });
		count++;
	}
	console.log(collection, count, "of", entries.length);
}
