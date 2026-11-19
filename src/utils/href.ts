const SAFE = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;

export const safeHref = (href: string | null | undefined) => {
	const value = href?.trim();
	return value && SAFE.test(value) ? value : undefined;
};
