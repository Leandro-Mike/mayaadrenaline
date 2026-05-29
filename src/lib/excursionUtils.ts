/**
 * Utilidades para datos de excursiones (API WordPress / headless).
 */

export function stripHtml(html: string): string {
	if (!html) {
		return "";
	}
	return html
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&#039;/g, "'")
		.replace(/&quot;/g, '"')
		.trim();
}

const ETIQUETA_TARIFA_MENOR_RE =
	/(menor|menores|niño|niños|niña|niñas|infant|infantil|child|children)/i;

export function splitPreciosAdicionalesMenoresYResto(
	rows: Array<{ etiqueta: string; precio: string }>
): {
	menores: Array<{ etiqueta: string; precio: string }>;
	resto: Array<{ etiqueta: string; precio: string }>;
} {
	const menores: Array<{ etiqueta: string; precio: string }> = [];
	const resto: Array<{ etiqueta: string; precio: string }> = [];
	for (const r of rows) {
		if (ETIQUETA_TARIFA_MENOR_RE.test(String(r.etiqueta || ""))) {
			menores.push(r);
		} else {
			resto.push(r);
		}
	}
	return { menores, resto };
}

export function parseMoney(value: string | number | undefined | null): number {
	if (value === undefined || value === null) {
		return 0;
	}
	const raw = String(value).trim();
	if (raw === "") {
		return 0;
	}
	const n = parseFloat(raw.replace(",", "."));
	return Number.isFinite(n) ? n : 0;
}

export type FeaturedExperienceItem = {
	title: string;
	href: string;
	image?: string;
};

type ExcursionForFeatured = {
	id: number;
	slug: string;
	title: { rendered: string };
	_embedded?: {
		"wp:featuredmedia"?: Array<{
			source_url: string;
			alt_text: string;
		}>;
	};
};

/**
 * Orden según `featured_excursion_ids` desde settings REST.
 */
export function buildFeaturedExperienceItems(
	ids: number[] | undefined,
	excursiones: ExcursionForFeatured[],
	apiBase: string,
	lang?: string
): FeaturedExperienceItem[] {
	if (!ids?.length || !excursiones?.length) {
		return [];
	}
	const byId = new Map(excursiones.map((e) => [e.id, e]));
	const base = apiBase.replace(/\/$/, "");
	const out: FeaturedExperienceItem[] = [];
	for (const rawId of ids) {
		const id =
			typeof rawId === "number" && Number.isFinite(rawId)
				? rawId
				: parseInt(String(rawId), 10);
		if (!Number.isFinite(id) || id < 1) {
			continue;
		}
		const e = byId.get(id);
		if (!e) {
			continue;
		}
		let img = e._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
		if (img && img.startsWith("/")) {
			img = `${base}${img}`;
		}
		const prefix = lang ? `/${lang}` : "";
		out.push({
			title: stripHtml(e.title.rendered),
			href: `${prefix}/excursiones/${e.slug}`,
			image: img || undefined,
		});
	}
	return out;
}
