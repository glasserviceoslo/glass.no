import { definePlugin } from "emdash";

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,}$/;

const settingsSchema = {
	enabled: { type: "boolean", label: "Slå på Google Analytics", default: false },
	measurement_id: { type: "string", label: "Måle-ID (G-…)", description: "Fra Google Analytics: Admin → Datastrømmer → Nettsted." },
} as const;

export function createPlugin() {
	return definePlugin({
		id: "analytics",
		version: "1.0.0",
		capabilities: ["hooks.page-fragments:register"],
		admin: { settingsSchema },
		hooks: {
			"page:fragments": async (_event, ctx) => {
				const [enabled, id] = await Promise.all([ctx.settings.get<boolean>("enabled"), ctx.settings.get<string>("measurement_id")]);
				const measurementId = id?.trim().toUpperCase() ?? "";
				if (!enabled || !MEASUREMENT_ID.test(measurementId)) return null;
				return {
					kind: "html",
					placement: "head",
					key: "ga4",
					html: [
						`<script type="text/plain" data-category="statistikk" async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`,
						`<script type="text/plain" data-category="statistikk">window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${measurementId}");</script>`,
					].join(""),
				};
			},
		},
	});
}
