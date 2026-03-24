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
	subtitle: string;
	href: string;
	image?: string;
};

type ExcursionForFeatured = {
	id: number;
	slug: string;
	title: { rendered: string };
	excerpt: { rendered: string };
	tagline?: string;
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
	apiBase: string
): FeaturedExperienceItem[] {
	if (!ids?.length || !excursiones?.length) {
		return [];
	}
	const byId = new Map(excursiones.map((e) => [e.id, e]));
	const base = apiBase.replace(/\/$/, "");
	const out: FeaturedExperienceItem[] = [];
	for (const rawId of ids) {
		const id = Number(rawId);
		if (!id) {
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
		const subtitle =
			stripHtml(e.excerpt?.rendered || "") ||
			String(e.tagline || "").trim();
		out.push({
			title: stripHtml(e.title.rendered),
			subtitle,
			href: `/excursiones/${e.slug}`,
			image: img || undefined,
		});
	}
	return out;
}
