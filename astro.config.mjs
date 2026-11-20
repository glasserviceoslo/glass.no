import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	site: "https://www.glass.no",
	output: "server",
	trailingSlash: "ignore",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [
				{ id: "search-text", version: "1.0.0", entrypoint: "./src/plugins/search-text.ts" },
				{ id: "analytics", version: "1.0.0", entrypoint: "./src/plugins/analytics.ts" },
			],
		}),
	],
	devToolbar: { enabled: false },
});
