export type ImageValue = { id: string; src?: string; alt?: string; width?: number; height?: number };

export type Surface = {
	background?: "white" | "light" | "tint" | "dark" | "brand" | "image";
	background_image?: ImageValue;
};
