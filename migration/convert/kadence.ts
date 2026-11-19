import {
	defaultTransformers,
	fallbackTransformer,
	parseInlineContent,
	type GutenbergBlock,
	type PortableTextBlock,
	type TransformContext,
} from "@emdash-cms/gutenberg-to-portable-text";
import { imageField, imageNode, type Media, type MediaMap } from "./media.ts";

export type Report = { dropped: Map<string, number>; unknown: Map<string, number>; shortcodes: Map<string, number> };

type Node =
	| PortableTextBlock
	| { _type: "reviewsMarker"; _key: string }
	| { _type: "bookingMarker"; _key: string; calLink: string }
	| { _type: "faqMarker"; _key: string; items: FaqItem[] };
type FaqItem = { question: string; answer: string };
type LayoutBlock = Record<string, unknown> & { _type: string; _key: string };

const SITE = /^https?:\/\/(www\.)?glass\.no/i;
const BOOKING_HREF = "/book-befaring/";
const ORANGE_BOOKING = new Set([2202, 2489, 3122, 3123]);
const BLUE_BOOKING = new Set([2493, 2496, 3120, 3121]);
const DROPPED = new Set([
	"kadence/spacer",
	"kadence/single-icon",
	"kadence/tableofcontents",
	"kadence/googlemaps",
	"core/separator",
	"core/post-title",
	"core/pattern",
	"core/social-link",
	"core/social-links",
	"complianz/document",
	"latepoint/customer-dashboard",
]);

const PALETTE_BACKGROUND: Record<string, string> = {
	palette1: "brand",
	palette2: "dark",
	palette3: "dark",
	palette4: "dark",
	palette5: "dark",
	palette6: "tint",
	palette7: "white",
	palette8: "white",
	palette9: "light",
};

const BRANDS: Record<string, string> = {
	"01M7TMJEJAC8GM4GWXMSHSSEES": "NorDan",
	"01M7TMJEKMEEGVMNRJZQWY0320": "Velux",
	"01M7TMJESNQK34SGW479GRX8PH": "Gilje",
	"01M7TMJEPDDFRG14441Y9KGT5V": "Lyssand",
	"01M7TMJETX70SB12ECK4TMT9G5": "Diplomat Dører",
	"01M7TMJEW51QQSF0Z5727SJ00S": "Vemundvik Snekkerfabrikk",
	"01M7TMJEQNX18VHJYJ34RHZP66": "Fjerdingstad",
	"01M7TMJEN2D82ATX04KRRR5440": "Nordvest Vinduet",
};
const PLAIN = new Set(["white", "light"]);

const hiddenOnDesktop = (block: GutenbergBlock) =>
	block.attrs?.vsdesk === true || (block.attrs?.metadata as { blockVisibility?: boolean } | undefined)?.blockVisibility === false;
const count = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
const decode = (text: string) =>
	text
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&#8211;/g, "–")
		.replace(/&#8217;/g, "’")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">");
const stripTags = (html: string) => decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+/g, " ").trim();
const innerOf = (html: string) => html.trim().replace(/^<(\w+)[^>]*>/, "").replace(/<\/\w+>\s*$/, "");
export const localHref = (href: string) => {
	const local = href.replace(SITE, "");
	return local === "" ? "/" : local;
};

export function createConverter(media: MediaMap, mediaByUrl: Map<string, Media>, reusable: Map<number, GutenbergBlock[]>, report: Report) {
	let keySeed = 0;
	const key = () => `k${(keySeed++).toString(36)}`;
	const options = { generateKeys: true, keyGenerator: key, mediaMap: media.wpUrls };

	const textBlock = (text: string, style: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "normal"): PortableTextBlock => ({
		_type: "block",
		_key: key(),
		style,
		children: [{ _type: "span", _key: key(), text, marks: [] }],
		markDefs: [],
	});

	const buttonBlock = (text: string, href: string, variant: "primary" | "secondary", blank = false): PortableTextBlock => {
		const mark = key();
		return {
			_type: "block",
			_key: key(),
			style: "normal",
			children: [{ _type: "span", _key: key(), text: text.trim(), marks: [mark] }],
			markDefs: [{ _type: "link", _key: mark, href: localHref(href), variant, ...(blank ? { blank: true } : {}) }],
		};
	};

	const booking = (variant: "primary" | "secondary") => buttonBlock("Book befaring", BOOKING_HREF, variant);

	const imageFromUrl = (url: string, alt?: string, link?: string) => {
		const found = media.byUrl(url);
		return found ? [imageNode(key(), found, alt, link ? localHref(link) : undefined)] : [];
	};

	const context: TransformContext = {
		transformBlocks: (blocks) => transform(blocks) as PortableTextBlock[],
		parseInlineContent: (html) => parseInlineContent(html, key),
		generateKey: key,
	};

	const variantOf = (attrs: Record<string, unknown>) =>
		["palette2", "palette3", "palette4", "palette5"].includes(String(attrs.background ?? "")) ? "secondary" : "primary";

	const custom: Record<string, (block: GutenbergBlock) => Node[]> = {
		"kadence/advancedheading": (block) => {
			const inner = innerOf(block.innerHTML);
			if (!stripTags(inner)) return [];
			const tag = String(block.attrs.htmlTag ?? "heading");
			const level = Number(block.attrs.level ?? 2);
			const style = tag === "heading" ? (`h${Math.min(Math.max(level, 1), 6)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") : "normal";
			const { children, markDefs } = parseInlineContent(inner, key);
			return [{ _type: "block", _key: key(), style, children, markDefs, ...(["center", "right"].includes(String(block.attrs.align)) ? { textAlign: block.attrs.align } : {}) }];
		},
		"kadence/image": (block) => {
			const src = block.innerHTML.match(/<img[^>]+src="([^"]+)"/)?.[1];
			const alt = decode(block.innerHTML.match(/<img[^>]+alt="([^"]*)"/)?.[1] ?? "");
			const link = (block.attrs.link as string | undefined) ?? block.innerHTML.match(/<a[^>]+href="([^"]+)"/)?.[1];
			const found = media.byId(block.attrs.id) ?? (src ? media.byUrl(src) : undefined);
			return found ? [imageNode(key(), found, alt, link ? localHref(link) : undefined)] : [];
		},
		"kadence/singlebtn": (block) => {
			const text = decode(String(block.attrs.text ?? "")).trim();
			if (!text) return [];
			const link = block.attrs.link as string | undefined;
			if (link) return [buttonBlock(text, link, variantOf(block.attrs), block.attrs.target === "_blank")];
			return /^book\s*befaring$/i.test(text) ? [buttonBlock(text, BOOKING_HREF, variantOf(block.attrs))] : [textBlock(text)];
		},
		"kadence/advancedbtn": (block) => {
			const children = transform(block.innerBlocks);
			const plain = children.filter((node) => node._type === "block" && !(node as any).markDefs?.length);
			if (plain.length === children.length && plain.length > 1) {
				return [textBlock(plain.map((node) => (node as any).children[0].text.trim()).join(" · "))];
			}
			return children;
		},
		"kadence/advancedgallery": (block) => {
			const ids = (block.attrs.ids as unknown[] | undefined) ?? [];
			const fromIds = ids.map((id) => media.byId(id)).filter((found): found is Media => Boolean(found));
			const fromHtml = fromIds.length
				? []
				: [...block.innerHTML.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => media.byUrl(match[1])).filter((found): found is Media => Boolean(found));
			const images = [...fromIds, ...fromHtml].map((found) => ({ ...imageNode(key(), found), _type: "image" as const }));
			if (!images.length) return [];
			const columns = Array.isArray(block.attrs.columns) ? Number((block.attrs.columns as number[])[1] ?? 3) : 3;
			return [{ _type: "gallery", _key: key(), images, columns }];
		},
		"kadence/infobox": (block) => {
			const title = stripTags(block.innerHTML.match(/<(h\d)[^>]*class="[^"]*kt-blocks-info-box-title[^"]*"[^>]*>([\s\S]*?)<\/\1>/)?.[2] ?? String(block.attrs.title ?? ""));
			const text = stripTags(block.innerHTML.match(/<p[^>]*class="[^"]*kt-blocks-info-box-text[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? String(block.attrs.contentText ?? ""));
			const link = (block.attrs.link as string | undefined) ?? block.innerHTML.match(/<a[^>]+href="([^"]+)"/)?.[1];
			const src = block.innerHTML.match(/<img[^>]+src="([^"]+)"/)?.[1];
			const more = block.innerHTML.match(/<a[^>]*kt-blocks-info-box-learnmore[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
			return [
				...(src ? imageFromUrl(src) : []),
				...(title ? [textBlock(title, "h3")] : []),
				...(text ? [textBlock(text)] : []),
				...(link && block.attrs.learnMore ? [buttonBlock(String(block.attrs.learnMore), link, "primary")] : []),
				...(!block.attrs.learnMore && more ? [buttonBlock(stripTags(more[2]), more[1], "primary")] : []),
			];
		},
		"kadence/accordion": (block) => [{ _type: "faqMarker", _key: key(), items: faqItems(block) }],
		"kadence/rowlayout": (block) => {
			const columns = block.innerBlocks.filter((column) => !hiddenOnDesktop(column)).map((column) => transform(column.innerBlocks));
			const pairs = columns.map((nodes) => nodes.filter((node) => node._type === "block" && plainText(node)));
			const isFacts = columns.length >= 2 && pairs.every((nodes, index) => nodes.length === 2 && nodes.length === columns[index].length && nodes.every((node) => plainText(node).length <= 40));
			if (isFacts) {
				return [{ _type: "facts", _key: key(), items: pairs.map(([label, value]) => ({ _key: key(), label: plainText(label), value: plainText(value) })) } as unknown as PortableTextBlock];
			}
			return columns.flat();
		},
		"kadence/column": (block) => columnNodes(block),
		"kadence/icon": (block) => {
			const items = block.innerBlocks
				.map((icon) => ({ icon: String(icon.attrs.icon ?? "").replace(/^[a-z]+_/, ""), href: String(icon.attrs.link ?? "") }))
				.filter((item) => item.icon && item.href);
			return items.length ? [{ _type: "icons", _key: key(), items: items.map((item) => ({ _key: key(), ...item })) } as unknown as PortableTextBlock] : [];
		},
		"kadence/tabs": (block) =>
			block.innerBlocks.flatMap((tab, index) => [
				...(Array.isArray(block.attrs.titles) && (block.attrs.titles as any[])[index]?.text
					? [textBlock(stripTags(String((block.attrs.titles as any[])[index].text)), "h3")]
					: []),
				...transform(tab.innerBlocks),
			]),
		"kadence/tab": (block) => transform(block.innerBlocks),
		"kadence/slider": (block) => transform(block.innerBlocks),
		"kadence/slide": (block) => transform(block.innerBlocks),
		"kadence/listitem": (block) => [{ ...textBlock(stripTags(block.innerHTML)), listItem: "bullet", level: 1 } as PortableTextBlock],
		"core/columns": (block) => transform(block.innerBlocks),
		"core/column": (block) => transform(block.innerBlocks),
		"core/group": (block) => transform(block.innerBlocks),
		"core/html": (block) => {
			const calLink = block.innerHTML.match(/calLink:\s*"([^"]+)"/)?.[1];
			if (calLink) return [{ _type: "bookingMarker", _key: key(), calLink }];
			return defaultTransformers["core/html"](block, options, context) as Node[];
		},
		"core/block": (block) => {
			const ref = Number(block.attrs.ref);
			if (ORANGE_BOOKING.has(ref)) return [booking("primary")];
			if (BLUE_BOOKING.has(ref)) return [booking("secondary")];
			const inner = reusable.get(ref);
			if (inner) return transform(inner);
			count(report.dropped, `core/block ref ${ref}`);
			return [];
		},
		"latepoint/book-button": (block) => [booking(block.attrs.bg_color === "#203164" ? "secondary" : "primary")],
		"core/shortcode": (block) => {
			const code = block.innerHTML.trim();
			const name = code.match(/^\[([a-z_-]+)/i)?.[1] ?? "?";
			count(report.shortcodes, name);
			if (name === "cal") return [buttonBlock(decode(code.match(/text="([^"]+)"/)?.[1] ?? "Book befaring"), BOOKING_HREF, "primary")];
			if (name === "trustindex") return [{ _type: "reviewsMarker", _key: key() }];
			return [];
		},
	};

	function faqItems(accordion: GutenbergBlock): FaqItem[] {
		return accordion.innerBlocks
			.filter((pane) => pane.blockName === "kadence/pane")
			.map((pane) => {
				const question = stripTags(pane.innerHTML.match(/kt-blocks-accordion-title[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? "");
				const answer = transform(pane.innerBlocks)
					.filter((node): node is PortableTextBlock => node._type === "block")
					.map((node: any) => `${node.listItem ? "• " : ""}${(node.children ?? []).map((child: any) => child.text).join("").trim()}`)
					.filter((text) => text.replace("• ", ""))
					.join("\n\n");
				if (question && !answer) count(report.dropped, "faq question without answer");
				return { question, answer };
			})
			.filter((item) => item.question && item.answer);
	}

	const fixLinks = (nodes: Node[]) => {
		for (const node of nodes as any[]) {
			for (const def of node.markDefs ?? []) if (typeof def.href === "string") def.href = localHref(def.href);
			if (node._type === "image" && typeof node.asset?._ref === "string" && !node.asset._ref.startsWith("/_emdash/")) {
				const found = media.byUrl(node.asset._ref);
				if (found) Object.assign(node, imageNode(node._key, found, node.alt, node.link));
			}
			if (node._type === "gallery") {
				node.images = node.images.flatMap((image: any) => {
					if (image.asset?._ref?.startsWith("/_emdash/")) return [image];
					const found = media.byUrl(image.asset?._ref ?? "");
					return found ? [imageNode(image._key, found, image.alt)] : [];
				});
			}
			if (node._type === "htmlBlock") count(report.unknown, String(node.originalBlockName ?? "html"));
		}
		return nodes;
	};

	function columnNodes(column: GutenbergBlock): Node[] {
		const photo = (column.attrs.backgroundImg as { bgImg?: string; bgImgID?: number }[] | undefined)?.[0];
		const found = photo?.bgImg ? (media.byId(photo.bgImgID) ?? media.byUrl(photo.bgImg)) : undefined;
		return [...(found ? [imageNode(key(), found, "")] : []), ...transform(column.innerBlocks)];
	}

	function transform(blocks: GutenbergBlock[]): Node[] {
		const out: Node[] = [];
		for (const block of blocks) {
			const name = block.blockName;
			if (hiddenOnDesktop(block)) {
				count(report.dropped, "hidden on desktop");
				continue;
			}
			if (!name) {
				if (stripTags(block.innerHTML)) out.push(...(fallbackTransformer(block, options, context) as Node[]));
				continue;
			}
			if (DROPPED.has(name) || name.startsWith("woocommerce/")) {
				count(report.dropped, name);
				continue;
			}
			const handler = custom[name] ?? (defaultTransformers[name] ? (b: GutenbergBlock) => defaultTransformers[name](b, options, context) as Node[] : undefined);
			if (handler) out.push(...handler(block));
			else {
				count(report.unknown, name);
				out.push(...(fallbackTransformer(block, options, context) as Node[]));
			}
		}
		return fixLinks(out);
	}

	const isText = (node: Node) => node._type === "block";
	const plainText = (node: any) => (node.children ?? []).map((child: any) => child.text).join("").trim();
	const isButton = (node: any) => node._type === "block" && node.children?.length === 1 && node.children[0].marks?.length === 1 && node.markDefs?.length === 1;
	const isHeading = (node: any) => node._type === "block" && /^h\d$/.test(node.style ?? "");
	const mediaOfNode = (node: any) => mediaByUrl.get(node.asset?._ref ?? "");
	const MARKERS = new Set(["reviewsMarker", "bookingMarker", "faqMarker"]);
	const ptOnly = (nodes: Node[]) => nodes.filter((node) => !MARKERS.has(node._type)) as PortableTextBlock[];
	const bookingBlock = (calLink: string, background: Record<string, unknown>) => ({ _type: "booking", _key: key(), heading: "", intro: "", cal_link: calLink, ...background });

	const background = (attrs: Record<string, unknown>) => {
		const bgImage = (attrs.bgImg as string | undefined) || undefined;
		if (bgImage) {
			const found = media.byId(attrs.bgImgID) ?? media.byUrl(bgImage);
			if (found) return { background: "image", background_image: imageField(found) };
		}
		const palette = String(attrs.bgColor ?? "");
		if (PALETTE_BACKGROUND[palette]) return { background: PALETTE_BACKGROUND[palette] };
		if (/^#/.test(palette)) return { background: /^#(0|1|2)/.test(palette) ? "dark" : "light" };
		return { background: "white" };
	};

	const layoutFor = (row: GutenbergBlock, count: number) => {
		if (count <= 1) return "1";
		if (count === 2) {
			const first = Number(row.attrs.firstColumnWidth ?? 0);
			const layout = String(row.attrs.colLayout ?? "equal");
			if (layout === "left-golden" || first > 55) return "2-1";
			if (layout === "right-golden" || (first > 0 && first < 45)) return "1-2";
			return "1-1";
		}
		return count === 3 ? "1-1-1" : "1-1-1-1";
	};

	const asCard = (nodes: Node[]) => {
		if (nodes.some((node) => MARKERS.has(node._type) || node._type === "table" || (node as any).listItem)) return undefined;
		const images = nodes.filter((node) => node._type === "image");
		const texts = nodes.filter((node) => isText(node) && !isButton(node));
		const buttons = nodes.filter(isButton);
		if (images.length > 1 || nodes.some((node) => !["image", "block"].includes(node._type))) return undefined;
		if (texts.map(plainText).join(" ").length > 450) return undefined;
		const [titleNode, ...rest] = texts;
		const link = (buttons[0] as any)?.markDefs?.[0]?.href ?? (images[0] as any)?.link;
		const found = images[0] ? mediaOfNode(images[0]) : undefined;
		return {
			_key: key(),
			image: found ? imageField(found, (images[0] as any).alt) : undefined,
			title: titleNode ? plainText(titleNode) : "",
			text: rest.map(plainText).filter(Boolean).join("\n\n"),
			url: link ?? "",
			link_label: buttons[0] ? plainText(buttons[0]) : "",
		};
	};

	function rowToLayout(row: GutenbergBlock, inherited?: Record<string, unknown>): LayoutBlock[] {
		const own = background(row.attrs);
		const bg = own.background === "white" && inherited ? inherited : own;
		const columns = row.innerBlocks.filter((column) => !hiddenOnDesktop(column) && (column.blockName === "kadence/column" || column.blockName === "core/column"));

		if (row.attrs.colLayout === "row" && columns.length > 1) {
			return columns.flatMap((column) => rowToLayout({ ...row, attrs: { ...row.attrs, colLayout: "equal" }, innerBlocks: [column] }, inherited));
		}

		if (columns.length === 1 && !columns[0].attrs.backgroundImg && columns[0].innerBlocks.length && columns[0].innerBlocks.every((child) => child.blockName === "kadence/rowlayout" || DROPPED.has(child.blockName ?? ""))) {
			return columns[0].innerBlocks.filter((child) => child.blockName === "kadence/rowlayout").flatMap((child) => rowToLayout(child, bg));
		}

		const formColumn = columns.find((column) => JSON.stringify(column).includes('"kadence/form"'));
		if (formColumn) {
			const intro = ptOnly(transform(formColumn.innerBlocks.filter((child) => child.blockName !== "kadence/form")));
			const heading = intro.find(isHeading) ?? intro[0];
			const aside = columns.filter((column) => column !== formColumn).flatMap((column) => ptOnly(columnNodes(column)));
			return [
				{
					_type: "contact_form",
					_key: key(),
					heading: heading ? plainText(heading) : "",
					intro: intro.filter((node) => node !== heading).map(plainText).filter(Boolean).join("\n\n"),
					form: "contact",
					...(aside.length ? { aside } : {}),
					...bg,
				},
			];
		}

		const converted = columns.map(columnNodes);
		const filled = converted.filter((nodes) => nodes.length);
		if (!filled.length) return [];

		const extras: LayoutBlock[] = [];
		for (const nodes of converted) {
			for (const node of nodes) {
				if (node._type === "faqMarker") extras.push({ _type: "faq", _key: key(), heading: "", items: node.items.map((item) => ({ _key: key(), ...item })), ...bg });
				if (node._type === "reviewsMarker") extras.push({ _type: "reviews", _key: key(), heading: "", ...bg });
				if (node._type === "bookingMarker") extras.push(bookingBlock(node.calLink, bg));
			}
		}
		const faqText = extras.length && extras[0]._type === "faq" && filled.length === 1 ? ptOnly(filled[0]) : [];
		const faqHeading = faqText.find(isHeading) ?? (faqText.length === 1 && plainText(faqText[0]).length < 80 ? faqText[0] : undefined);
		if (faqHeading) extras[0].heading = plainText(faqHeading);
		const remaining = converted.map((nodes) => ptOnly(nodes).filter((node) => node !== faqHeading));

		if (filled.length >= 2) {
			const cards = remaining.filter((nodes) => nodes.length).map(asCard);
			const sameShape = cards.every((card) => card?.title) && (cards.every((card) => card?.image) || cards.every((card) => !card?.image));
			if ((cards.length >= 3 || cards.every((card) => card?.image)) && sameShape) {
				const widths = cards.map((card) => Number(card?.image?.width ?? 0));
				const style = widths.every((width) => width > 0 && width <= 320) ? "icon" : "image";
				return [{ _type: "cards", _key: key(), columns: String(Math.min(Math.max(cards.length, 2), 6)), style, items: cards, ...bg }, ...extras];
			}
		}

		const nonEmpty = remaining.filter((nodes) => nodes.length);
		if (!nonEmpty.length) return extras;
		if (nonEmpty.length > 4) {
			return [{ _type: "section", _key: key(), layout: "1", align: "left", column_1: nonEmpty.flat(), ...bg }, ...extras];
		}
		return [...sectionFrom(row, remaining, bg), ...extras];
	}

	function sectionFrom(row: GutenbergBlock, columns: PortableTextBlock[][], bg: Record<string, unknown>): LayoutBlock[] {
		const kept = columns.filter((nodes) => nodes.length);
		if (!kept.length) return [];
		const centered = row.attrs.textAlign === "center" || JSON.stringify(row.attrs).includes('"center"');
		return [
			{
				_type: "section",
				_key: key(),
				layout: layoutFor(row, kept.length),
				align: centered && kept.length === 1 ? "center" : "left",
				...Object.fromEntries(kept.map((nodes, index) => [`column_${index + 1}`, nodes])),
				...bg,
			},
		];
	}

	function pageLayout(blocks: GutenbergBlock[]): LayoutBlock[] {
		const layout: LayoutBlock[] = [];
		let loose: GutenbergBlock[] = [];
		const flushLoose = () => {
			const nodes = transform(loose);
			loose = [];
			const pt = ptOnly(nodes);
			if (pt.length) layout.push({ _type: "section", _key: key(), layout: "1", align: "left", column_1: pt, background: "white" });
			for (const node of nodes) if (node._type === "reviewsMarker") layout.push({ _type: "reviews", _key: key(), heading: "", background: "white" });
			for (const node of nodes) if (node._type === "bookingMarker") layout.push(bookingBlock(node.calLink, { background: "white" }));
		};
		for (const block of blocks) {
			if (hiddenOnDesktop(block)) continue;
			if (!block.blockName && !stripTags(block.innerHTML)) continue;
			if (block.blockName === "kadence/rowlayout") {
				flushLoose();
				layout.push(...rowToLayout(block));
			} else {
				loose.push(block);
			}
		}
		flushLoose();
		const folded = layout.flatMap((block, index) => {
			const next = layout[index + 1];
			const title = headingOnly(block);
			if (title && next?._type === "cards" && !next.heading) {
				next.heading = title;
				return [];
			}
			return [block];
		});
		return withSurfaces(withHero(folded.map(asLogos)));
	}

	function brandOf(image: any) {
		const id = mediaOfNode(image)?.storageKey?.replace(/\.[a-z]+$/, "");
		return id ? BRANDS[id] : undefined;
	}

	function asLogos(block: LayoutBlock): LayoutBlock {
		if (block._type !== "section" || block.column_2) return block;
		const nodes = (block.column_1 as any[] | undefined) ?? [];
		if (nodes.length !== 1 || nodes[0]._type !== "gallery" || !nodes[0].images.every(brandOf)) return block;
		return {
			_type: "logos",
			_key: block._key,
			items: nodes[0].images.map((image: any) => {
				const title = brandOf(image)!;
				return { _key: key(), title, image: imageField(mediaOfNode(image)!, title) };
			}),
		};
	}

	function withHero(layout: LayoutBlock[]): LayoutBlock[] {
		const [first, second, ...rest] = layout;
		const titleNodes = (first?.column_1 as any[] | undefined) ?? [];
		if (first?._type !== "section" || first.column_2 || titleNodes.length !== 1 || titleNodes[0].style !== "h1") return layout;
		if (second?._type !== "section" || second.column_3) return layout;
		const single = (second.column_2 ? undefined : (second.column_1 as any[])) ?? [];
		const lone = single[0]?._type === "gallery" && single[0].images.length === 1 ? { ...single[0].images[0] } : single[0]?._type === "image" ? single[0] : undefined;
		const columns = (second.column_2 ? [second.column_1, second.column_2] : lone ? [[lone], single.slice(1)] : [second.column_1]) as any[][];
		const photoIndex = columns.findIndex((nodes) => nodes.length === 1 && nodes[0]._type === "image");
		if (columns.length === 2 && photoIndex < 0) return layout;
		const text = columns.length === 2 ? columns[1 - photoIndex] : columns[0];
		if (columns.length === 1 && (!isHeading(text[0]) || text.some((node) => node._type !== "block"))) return layout;
		const [lead, ...body] = /^h[2-4]$/.test(text[0]?.style ?? "") ? text : [undefined, ...text];
		const photo = photoIndex >= 0 ? columns[photoIndex][0] : undefined;
		const found = photo ? mediaOfNode(photo) : undefined;
		return [
			{
				_type: "page_hero",
				_key: first._key,
				title: plainText(titleNodes[0]),
				...(lead ? { heading: plainText(lead) } : {}),
				body,
				...(found ? { image: imageField(found, photo.alt) } : {}),
			},
			...rest,
		];
	}

	function surfaceGroup(block: LayoutBlock) {
		if (block._type === "page_hero" || block._type === "logos") return "intro";
		if (block._type === "section" && block.layout !== "1" && JSON.stringify(block).includes('"_type":"image"')) return "media";
		return block._type;
	}

	function withSurfaces(layout: LayoutBlock[]): LayoutBlock[] {
		let surface = "white";
		let group = "";
		return layout.map((block) => {
			if (block.background && !PLAIN.has(String(block.background))) {
				group = "";
				return block;
			}
			const next = surfaceGroup(block);
			if (next !== group) surface = surface === "light" ? "white" : "light";
			group = next;
			return block._type === "logos" || block._type === "page_hero" ? block : { ...block, background: surface };
		});
	}

	function headingOnly(block: LayoutBlock) {
		if (block._type !== "section" || block.layout !== "1" || block.column_2) return undefined;
		const nodes = (block.column_1 as Node[] | undefined) ?? [];
		return nodes.length === 1 && isHeading(nodes[0]) ? plainText(nodes[0]) : undefined;
	}

	function withoutForms(blocks: GutenbergBlock[]): GutenbergBlock[] {
		return blocks.flatMap((block) => {
			if (block.blockName === "kadence/form") {
				count(report.dropped, "kadence/form in a post");
				return [];
			}
			return [{ ...block, innerBlocks: withoutForms(block.innerBlocks) }];
		});
	}

	function postContent(blocks: GutenbergBlock[]): PortableTextBlock[] {
		return transform(withoutForms(blocks)).flatMap((node) => {
			if (node._type === "faqMarker") return node.items.flatMap((item) => [textBlock(item.question, "h3"), ...item.answer.split("\n\n").map((text) => textBlock(text))]);
			if (node._type === "reviewsMarker" || node._type === "bookingMarker") return [];
			return [node as PortableTextBlock];
		});
	}

	return { pageLayout, postContent };
}
