import { writeFileSync } from "node:fs";
import { blockTypes, layoutField } from "./schema.ts";

const common = [
	{ slug: "title", label: "Title", type: "string", required: true },
	{ slug: "excerpt", label: "Excerpt", type: "text" },
	{ slug: "featured_image", label: "Featured image", type: "image" },
];

const seed = {
	$schema: "https://emdashcms.com/seed.schema.json",
	version: "1",
	meta: { name: "glass.no", description: "Glass-Service Svendsen og Sønn AS", author: "glass.no" },
	settings: { title: "glass.no", tagline: "Bytting av vindu og glass", seo: { titleSeparator: "|" } },
	blockTypes: blockTypes.map(({ slug, label, description, fields }) => ({
		slug,
		label,
		description,
		currentVersion: 1,
		versions: [{ version: 1, fields }],
	})),
	collections: [
		{
			slug: "pages",
			label: "Pages",
			labelSingular: "Page",
			urlPattern: "/{slug}/",
			supports: ["drafts", "revisions", "preview", "seo"],
			fields: [...common, layoutField],
		},
		{
			slug: "posts",
			label: "Posts",
			labelSingular: "Post",
			urlPattern: "/{slug}/",
			supports: ["drafts", "revisions", "preview", "seo"],
			fields: [...common, { slug: "content", label: "Content", type: "portableText" }, layoutField],
		},
	],
	menus: [],
	content: {},
};

writeFileSync(process.argv[2], `${JSON.stringify(seed, null, "\t")}\n`);
