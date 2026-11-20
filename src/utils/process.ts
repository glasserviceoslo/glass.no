import { textOf } from "./slug";

export type ProcessStep = { title: string; text: string };

export const splitProcess = (blocks: unknown[] = []) => {
	const parsed = (blocks as { children?: { text?: string }[] }[]).map((block) => /^\s*(\d+)\.\s*([^\n]+)\n([\s\S]+)$/.exec(textOf(block)));
	const first = parsed.findIndex(Boolean);
	const last = parsed.findLastIndex(Boolean);
	const steps: ProcessStep[] = parsed.filter((match): match is RegExpExecArray => !!match).map((match) => ({ title: match[2].trim(), text: match[3].trim() }));
	if (steps.length < 2) return { lead: blocks, steps: [], after: [] };
	return { lead: blocks.slice(0, first), steps, after: blocks.slice(last + 1) };
};
