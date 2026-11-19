import { api } from "./api.ts";
import { blockTypes, layoutField } from "./schema.ts";

type BlockTypeItem = { currentVersion: number; versions: { version: number; fingerprint: string; fields: unknown }[] };

export async function syncSchema() {
	const existing = new Set((await api<{ items: { slug: string }[] }>("/schema/block-types")).items.map((type) => type.slug));
	for (const type of blockTypes) {
		if (!existing.has(type.slug)) {
			await api("/schema/block-types", { method: "POST", body: type });
			continue;
		}
		const { item } = await api<{ item: BlockTypeItem }>(`/schema/block-types/${type.slug}`);
		const active = item.versions.find((version) => version.version === item.currentVersion)!;
		if (JSON.stringify(active.fields).length === JSON.stringify(type.fields).length) continue;
		await api(`/schema/block-types/${type.slug}`, {
			method: "PUT",
			body: { expectedFingerprint: active.fingerprint, label: type.label, description: type.description, fields: type.fields },
		});
	}

	const pages = await api<{ item: { fields: { slug: string }[] } }>("/schema/collections/pages?includeFields=true");
	if (pages.item.fields.some((field) => field.slug === "layout")) {
		await api("/schema/collections/pages/fields/layout", { method: "PUT", body: { validation: layoutField.validation } });
	} else {
		await api("/schema/collections/pages/fields", { method: "POST", body: layoutField });
	}

	for (const collection of ["pages", "posts"]) {
		const current = await api<{ item: { supports: string[] } }>(`/schema/collections/${collection}`);
		await api(`/schema/collections/${collection}`, {
			method: "PUT",
			body: { hasSeo: true, supports: [...new Set([...current.item.supports, "seo"])], urlPattern: "/{slug}/" },
		});
	}
}
