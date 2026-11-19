export const contactKind = (value: string) => {
	if (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim())) return "email";
	if (/^\+?[\d\s]{8,}$/.test(value.trim())) return "phone";
	return undefined;
};

export const contactHref = (value: string) => {
	const kind = contactKind(value);
	if (kind === "email") return `mailto:${value.trim()}`;
	if (kind === "phone") return `tel:${value.replace(/\s/g, "")}`;
	return undefined;
};
