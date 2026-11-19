const backgrounds = ["white", "light", "tint", "dark", "brand", "image"];

const backgroundFields = [
	{ slug: "background", label: "Background", type: "select", defaultValue: "white", validation: { options: backgrounds } },
	{ slug: "background_image", label: "Background image", type: "image" },
];

export const blockTypes = [
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
			{ slug: "heading", label: "Heading", type: "string" },
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
