import { definePlugin } from "emdash";

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,}$/;
const ADS_ID = /^AW-[0-9]{6,}$/;

const settingsSchema = {
	enabled: { type: "boolean", label: "Slå på Google-måling", default: false },
	measurement_id: { type: "string", label: "Google Analytics måle-ID (G-…)", description: "Fra Google Analytics: Admin → Datastrømmer → Nettsted." },
	ads_id: { type: "string", label: "Google Ads-ID (AW-…)", description: "Valgfritt. Fra Google Ads: Verktøy → Konverteringer → Google-taggen." },
} as const;

const clean = (value: string | null, pattern: RegExp) => {
	const id = value?.trim().toUpperCase() ?? "";
	return pattern.test(id) ? id : undefined;
};

export function createPlugin() {
	return definePlugin({
		id: "analytics",
		version: "1.1.0",
		capabilities: ["hooks.page-fragments:register"],
		admin: { settingsSchema },
		hooks: {
			"page:fragments": async (_event, ctx) => {
				const [enabled, measurement, ads] = await Promise.all([
					ctx.settings.get<boolean>("enabled"),
					ctx.settings.get<string>("measurement_id"),
					ctx.settings.get<string>("ads_id"),
				]);
				const analyticsId = clean(measurement, MEASUREMENT_ID);
				const adsId = clean(ads, ADS_ID);
				if (!enabled || (!analyticsId && !adsId)) return null;
				const tags = { src: `https://www.googletagmanager.com/gtag/js?id=${analyticsId ?? adsId}`, analytics: analyticsId, ads: adsId };
				return {
					kind: "inline-script",
					placement: "head",
					key: "google-tag",
					code: [
						"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}",
						'gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",wait_for_update:500});',
						'gtag("set","ads_data_redaction",true);',
						'gtag("js",new Date());',
						`window.googleTags=${JSON.stringify(tags)};`,
					].join(""),
				};
			},
		},
	});
}
