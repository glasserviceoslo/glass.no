type ImageLike = { id?: string; src?: string; meta?: { storageKey?: string } } | null | undefined;
type Block = { _type?: string; image?: ImageLike; images?: { image?: ImageLike }[] };

const urlOf = (image: ImageLike, origin: string) => {
	const key = image?.meta?.storageKey;
	if (key) return `${origin}/_emdash/api/media/file/${key}`;
	if (image?.src) return new URL(image.src, origin).toString();
	return undefined;
};

export function shareImage(data: { layout?: unknown; featured_image?: unknown }, origin: string) {
	const blocks = (Array.isArray(data.layout) ? data.layout : []) as Block[];
	const candidates: ImageLike[] = [
		...blocks.filter((block) => block._type === "hero" || block._type === "page_hero").map((block) => block.image),
		data.featured_image as ImageLike,
		blocks.find((block) => block._type === "project_gallery")?.images?.[0]?.image,
	];
	for (const candidate of candidates) {
		const url = urlOf(candidate, origin);
		if (url && !/\.(png|svg)$/i.test(url)) return url;
	}
	return undefined;
}
