import { api, listAll } from "../convert/api.ts";

type Media = { id: string; storageKey: string; width?: number; height?: number };

const SHARE_IMAGE = "01M7TMJ112XDVBKFNDHS3PH9QS";

const library = await listAll<Media>("/media");
const share = library.find((item) => item.id === SHARE_IMAGE || item.storageKey.startsWith(SHARE_IMAGE));
if (!share) throw new Error(`no media ${SHARE_IMAGE}`);

await api("/settings", {
	method: "POST",
	body: {
		title: "Glass.no",
		url: "https://www.glass.no",
		social: {
			facebook: "https://www.facebook.com/glass1889",
			instagram: "https://www.instagram.com/glass_siden_1889",
		},
		seo: {
			titleSeparator: "|",
			defaultOgImage: { mediaId: share.id, alt: "Hus med store vindusflater og glassrekkverk rundt terrassen" },
		},
	},
});
const settings = await api<{ title: string; social?: Record<string, string>; seo?: Record<string, unknown> }>("/settings");
console.log(JSON.stringify({ title: settings.title, social: settings.social, separator: settings.seo?.titleSeparator, shareImage: Boolean(settings.seo?.defaultOgImage) }));
