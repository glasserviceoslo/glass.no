import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { cloudflareEmail } from "@emdash-cms/cloudflare/plugins";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

const sharedTags = ["emdash:settings", "emdash:menu:primary", "shared_sections", "posts", "google_reviews"];

export default defineConfig({
	site: "https://www.glass.no",
	output: "server",
	trailingSlash: "ignore",
	prefetch: { prefetchAll: true, defaultStrategy: "hover" },
	redirects: {
		"/driftspanel-alpha": { status: 302, destination: "/_emdash/admin" },
	},
	i18n: {
		defaultLocale: "nb",
		locales: ["nb"],
	},
	adapter: cloudflare(),
	cache: { provider: cacheCloudflare() },
	routeRules: {
		"/": { maxAge: 3600, swr: 86400, tags: sharedTags },
		"/[slug]": { maxAge: 3600, swr: 86400, tags: sharedTags },
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
		domains: ["www.glass.no", "ny.glass.no", "localhost"],
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({ binding: "MEDIA" }),
			admin: {
				logo: "/images/logo.png",
				siteName: "Glass.no",
				footerLabel: false,
				favicon: "/images/favicon.png",
				locales: ["nb"],
			},
			plugins: [
				{ id: "search-text", version: "1.0.0", entrypoint: "./src/plugins/search-text.ts" },
				{ id: "analytics", version: "1.0.0", entrypoint: "./src/plugins/analytics.ts" },
				{ id: "google-reviews", version: "1.0.0", entrypoint: "./src/plugins/google-reviews.ts" },
				{ id: "email-design", version: "1.0.0", entrypoint: "./src/plugins/email-design.ts" },
				cloudflareEmail({ from: { email: "skjema@post.glass.no", name: "Glass.no" } }),
			],
		}),
		{
			name: "image-cache",
			hooks: {
				"astro:config:setup": ({ updateConfig }) => updateConfig({ image: { endpoint: { entrypoint: "./src/image-endpoint.ts" } } }),
			},
		},
	],
	devToolbar: { enabled: false },
});
