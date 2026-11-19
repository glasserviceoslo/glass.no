const backgrounds = ["white", "light", "tint", "dark", "brand", "image"];

const backgroundFields = [
	{ slug: "background", label: "Background", type: "select", defaultValue: "white", validation: { options: backgrounds } },
	{ slug: "background_image", label: "Background image", type: "image" },
];

const link = (prefix: string, label: string) => [
	{ slug: `${prefix}_label`, label: `${label} text`, type: "string" },
	{ slug: `${prefix}_url`, label: `${label} link`, type: "string" },
];

export const blockTypes = [
	{
		slug: "page_hero",
		label: "Page hero",
		description: "The page title with a subtitle, text, buttons and a photograph",
		fields: [
			{ slug: "title", label: "Page title", type: "string", required: true },
			{ slug: "heading", label: "Subtitle", type: "string" },
			{ slug: "body", label: "Text and buttons", type: "portableText" },
			{ slug: "image", label: "Photograph", type: "image" },
		],
	},
	{
		slug: "hero",
		label: "Hero",
		description: "The first screen: heading, one line, two buttons and a photograph",
		fields: [
			{ slug: "kicker", label: "Line above the heading", type: "string" },
			{ slug: "heading", label: "Heading", type: "string", required: true },
			{ slug: "lead", label: "Lead", type: "text" },
			...link("primary", "Main button"),
			...link("secondary", "Second button"),
			{ slug: "image", label: "Photograph", type: "image" },
			{ slug: "float_label", label: "Card label", type: "string" },
			{ slug: "float_title", label: "Card text", type: "string" },
		],
	},
	{
		slug: "services",
		label: "Services",
		description: "Services as a list beside a photograph that changes with the row, or as photo cards",
		fields: [
			{ slug: "label", label: "Label", type: "string" },
			{ slug: "heading", label: "Heading", type: "string", required: true },
			{ slug: "layout", label: "Layout", type: "select", defaultValue: "list", validation: { options: ["list", "cards"] } },
			{ slug: "intro", label: "Intro", type: "text" },
			{
				slug: "items",
				label: "Services",
				type: "repeater",
				validation: {
					minItems: 2,
					maxItems: 6,
					subFields: [
						{ slug: "title", label: "Name", type: "string", required: true },
						{ slug: "text", label: "One line", type: "text" },
						{ slug: "url", label: "Link", type: "string" },
						{ slug: "image", label: "Photograph", type: "image" },
					],
				},
			},
		],
	},
	{
		slug: "features",
		label: "Features",
		description: "Why choose us: text and a list beside a photograph, then short cards and figures",
		fields: [
			{ slug: "label", label: "Label", type: "string" },
			{ slug: "heading", label: "Heading", type: "string", required: true },
			{ slug: "intro", label: "Intro", type: "text" },
			{ slug: "bullets", label: "List (one item per line)", type: "text" },
			{ slug: "image", label: "Photograph", type: "image" },
			{ slug: "facts", label: "Figures (one per line, figure | label)", type: "text" },
			{
				slug: "items",
				label: "Cards",
				type: "repeater",
				validation: {
					maxItems: 6,
					subFields: [
						{ slug: "title", label: "Title", type: "string", required: true },
						{ slug: "text", label: "Text", type: "text" },
						{ slug: "icon", label: "Icon", type: "image" },
					],
				},
			},
		],
	},
	{
		slug: "logos",
		label: "Logos",
		description: "A row of brand logos",
		fields: [
			{
				slug: "items",
				label: "Logos",
				type: "repeater",
				validation: {
					minItems: 1,
					maxItems: 12,
					subFields: [
						{ slug: "title", label: "Brand", type: "string", required: true },
						{ slug: "image", label: "Logo", type: "image" },
						{ slug: "url", label: "Link", type: "string" },
					],
				},
			},
		],
	},
	{
		slug: "statement",
		label: "Statement",
		description: "A paragraph of text beside an optional photograph",
		fields: [
			{ slug: "label", label: "Label", type: "string" },
			{ slug: "text", label: "Statement", type: "text", required: true },
			{ slug: "strong", label: "Word to stress", type: "string" },
			{ slug: "image", label: "Photograph", type: "image" },
		],
	},
	{
		slug: "steps",
		label: "Steps",
		description: "Two to four steps, each with a photograph",
		fields: [
			{ slug: "heading", label: "Heading", type: "string", required: true },
			{
				slug: "items",
				label: "Steps",
				type: "repeater",
				validation: {
					minItems: 2,
					maxItems: 4,
					subFields: [
						{ slug: "title", label: "Title", type: "string", required: true },
						{ slug: "text", label: "Two lines", type: "text" },
						{ slug: "image", label: "Photograph", type: "image" },
					],
				},
			},
		],
	},
	{
		slug: "contact",
		label: "Contact",
		description: "Address, hours, phone and the booking button beside a photograph",
		fields: [
			{ slug: "heading", label: "Heading", type: "string", required: true },
			{ slug: "intro", label: "Intro", type: "text" },
			{ slug: "address", label: "Address", type: "text" },
			{ slug: "hours", label: "Opening hours (one line per row, days | time)", type: "text" },
			{ slug: "phone", label: "Phone", type: "string" },
			...link("primary", "Button"),
			{ slug: "image", label: "Photograph", type: "image" },
			{ slug: "show_form", label: "Show the contact form in place of the photograph", type: "boolean" },
		],
	},
	{
		slug: "section",
		label: "Section",
		description: "Text, images and buttons in one to four columns",
		fields: [
			{ slug: "layout", label: "Columns", type: "select", defaultValue: "1", validation: { options: ["1", "1-1", "2-1", "1-2", "1-1-1", "1-1-1-1"] } },
			{ slug: "align", label: "Alignment", type: "select", defaultValue: "left", validation: { options: ["left", "center"] } },
			{ slug: "column_1", label: "Column 1", type: "portableText" },
			{ slug: "column_2", label: "Column 2", type: "portableText" },
			{ slug: "column_3", label: "Column 3", type: "portableText" },
			{ slug: "column_4", label: "Column 4", type: "portableText" },
			...backgroundFields,
			{ slug: "anchor_id", label: "Section ID", type: "string" },
		],
	},
	{
		slug: "cards",
		label: "Cards",
		description: "A grid of cards with an image, title, text and link",
		fields: [
			{ slug: "heading", label: "Heading", type: "string" },
			{ slug: "columns", label: "Cards per row", type: "select", defaultValue: "3", validation: { options: ["2", "3", "4", "5", "6"] } },
			{ slug: "style", label: "Style", type: "select", defaultValue: "image", validation: { options: ["image", "icon"] } },
			{
				slug: "items",
				label: "Cards",
				type: "repeater",
				validation: {
					minItems: 1,
					maxItems: 24,
					subFields: [
						{ slug: "image", label: "Image", type: "image" },
						{ slug: "title", label: "Title", type: "string" },
						{ slug: "text", label: "Text", type: "text" },
						{ slug: "url", label: "Link", type: "string" },
						{ slug: "link_label", label: "Link text", type: "string" },
					],
				},
			},
			...backgroundFields,
		],
	},
	{
		slug: "faq",
		label: "Questions and answers",
		fields: [
			{ slug: "label", label: "Label", type: "string" },
			{ slug: "heading", label: "Heading", type: "string" },
			{ slug: "intro", label: "Intro", type: "text" },
			{
				slug: "items",
				label: "Questions",
				type: "repeater",
				validation: {
					minItems: 1,
					maxItems: 30,
					subFields: [
						{ slug: "question", label: "Question", type: "string", required: true },
						{ slug: "answer", label: "Answer", type: "text", required: true },
					],
				},
			},
			...backgroundFields,
		],
	},
	{
		slug: "contact_form",
		label: "Contact form",
		fields: [
			{ slug: "heading", label: "Heading", type: "string" },
			{ slug: "intro", label: "Intro", type: "text" },
			{ slug: "form", label: "Form", type: "select", defaultValue: "contact", validation: { options: ["contact"] } },
			{ slug: "aside", label: "Text beside the form", type: "portableText" },
			...backgroundFields,
		],
	},
	{
		slug: "booking",
		label: "Booking",
		description: "A Cal.com booking calendar",
		fields: [
			{ slug: "heading", label: "Heading", type: "string" },
			{ slug: "intro", label: "Intro", type: "text" },
			{ slug: "cal_link", label: "Cal.com link", type: "string", required: true, defaultValue: "glassno/befaring" },
			...backgroundFields,
		],
	},
	{
		slug: "reviews",
		label: "Reviews",
		fields: [{ slug: "heading", label: "Heading", type: "string" }, ...backgroundFields],
	},
];

export const layoutField = {
	slug: "layout",
	label: "Layout",
	type: "blocks",
	validation: { allowedTypes: blockTypes.map((type) => type.slug), maxItems: 80 },
};
