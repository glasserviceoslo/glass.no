import { api } from "./api.ts";
import { blockTypes, layoutField, searchTextField, sharedSectionsCollection } from "./schema.ts";

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

	const collections = await api<{ items: { slug: string }[] }>("/schema/collections");
	if (!collections.items.some((collection) => collection.slug === sharedSectionsCollection.slug)) {
		await api("/schema/collections", { method: "POST", body: sharedSectionsCollection });
	}
	const shared = await api<{ item: { fields: { slug: string }[] } }>(`/schema/collections/${sharedSectionsCollection.slug}?includeFields=true`);
	if (!shared.item.fields.some((field) => field.slug === "title")) {
		await api(`/schema/collections/${sharedSectionsCollection.slug}/fields`, { method: "POST", body: { slug: "title", label: "Title", type: "string", required: true } });
	}
	if (!shared.item.fields.some((field) => field.slug === "layout")) {
		await api(`/schema/collections/${sharedSectionsCollection.slug}/fields`, { method: "POST", body: layoutField });
	}

	for (const collection of ["pages", "posts"]) {
		const schema = await api<{ item: { fields: { slug: string }[] } }>(`/schema/collections/${collection}?includeFields=true`);
		if (schema.item.fields.some((field) => field.slug === "layout")) {
			await api(`/schema/collections/${collection}/fields/layout`, { method: "PUT", body: { validation: layoutField.validation } });
		} else {
			await api(`/schema/collections/${collection}/fields`, { method: "POST", body: layoutField });
		}
	}

	const searchable: Record<string, string[]> = { pages: ["title", "excerpt"], posts: ["title", "excerpt", "content"] };
	for (const collection of ["pages", "posts"]) {
		const schema = await api<{ item: { fields: { slug: string; searchable?: boolean }[] } }>(`/schema/collections/${collection}?includeFields=true`);
		if (!schema.item.fields.some((field) => field.slug === "search_text")) {
			await api(`/schema/collections/${collection}/fields`, { method: "POST", body: searchTextField });
		}
		for (const slug of searchable[collection]) {
			if (!schema.item.fields.find((field) => field.slug === slug)?.searchable) {
				await api(`/schema/collections/${collection}/fields/${slug}`, { method: "PUT", body: { searchable: true } });
			}
		}
	}

	for (const collection of ["pages", "posts"]) {
		const current = await api<{ item: { supports: string[] } }>(`/schema/collections/${collection}`);
		await api(`/schema/collections/${collection}`, {
			method: "PUT",
			body: { hasSeo: true, supports: [...new Set([...current.item.supports, "seo", "search"])], urlPattern: "/{slug}/" },
		});
	}
}
