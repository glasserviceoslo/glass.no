export type ImageValue = { id: string; src?: string; alt?: string; width?: number; height?: number; mimeType?: string };

export type Surface = {
	background?: "white" | "light" | "tint" | "dark" | "brand" | "image";
	background_image?: ImageValue;
};
