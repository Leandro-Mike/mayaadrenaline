"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ma-accommodation-promo-dismissed";
const VILLA_CISNE_URL = "https://villa-cisne.mayaadrenaline.com.mx/";

export default function AccommodationPromoPopup() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const id = requestAnimationFrame(() => {
			try {
				if (sessionStorage.getItem(STORAGE_KEY)) {
					return;
				}
			} catch {
				/* sessionStorage no disponible */
			}
			setVisible(true);
		});
		return () => cancelAnimationFrame(id);
	}, []);

	const dismiss = () => {
		try {
			sessionStorage.setItem(STORAGE_KEY, "1");
		} catch {
			/* noop */
		}
		setVisible(false);
	};

	if (!visible) {
		return null;
	}

	return (
		<div
			className="fixed bottom-4 right-4 z-[100] w-[min(100vw-2rem,288px)] rounded-xl border border-white/15 bg-gradient-to-br from-[#011d18] to-[#1e2601] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] font-montserrat"
			role="dialog"
			aria-labelledby="accommodation-promo-title"
		>
			<button
				type="button"
				onClick={dismiss}
				className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-ma-gris-claro/80 transition hover:bg-white/10 hover:text-white"
				aria-label="Cerrar aviso"
			>
				×
			</button>
			<p
				id="accommodation-promo-title"
				className="pr-7 text-sm font-medium leading-snug text-ma-gris-claro"
			>
				Necesitas alojamiento en la Rivera Maya
			</p>
			<a
				href={VILLA_CISNE_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-ma-amarillo px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
			>
				Ver Villa Cisne
			</a>
		</div>
	);
}
