import Image from "next/image";
import CarruselExperiencias from "@/components/CarruselExperiencias";
import ExperienciasPopulares from "@/components/ExperienciasPopulares";
import BotonCTA2 from "@/components/botonCTA2";

// Definir la forma de los datos de Excursión desde la API de WP
interface Excursion {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  precio: string; // El campo personalizado que añadimos
  tagline: string; // El campo personalizado que añadimos
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
  link: string;
}

import { Settings } from "@/types/settings";
import { sortExcursionsByTitleAsc } from "@/lib/excursionSort";
import { buildFeaturedExperienceItems } from "@/lib/excursionUtils";

function getWpApiBase(): string {
  const raw =
    process.env.WP_BUILD_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://back.mayaadrenaline.com.mx";
  return raw.replace(/\/$/, "");
}

function normalizeFeaturedExcursionIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return [
    ...new Set(
      raw
        .map((id) =>
          typeof id === "number" && Number.isFinite(id)
            ? id
            : parseInt(String(id), 10)
        )
        .filter((id) => Number.isFinite(id) && id > 0)
    ),
  ];
}
async function getSettings(lang: string): Promise<Settings> {
  const apiUrl = getWpApiBase();
  try {
    const res = await fetch(`${apiUrl}/wp-json/maya-adrenaline/v1/settings?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {} as Settings;
  }
}

async function getExcursiones(lang: string): Promise<Excursion[]> {
  const apiUrl = getWpApiBase();
  const res = await fetch(
    `${apiUrl}/wp-json/wp/v2/excursion?per_page=100&_embed&orderby=menu_order&order=asc&lang=${lang}`,
    {
      next: { revalidate: 10 },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** Excursiones que faltan en el listado (p. ej. están más allá de la primera página). */
async function fetchExcursionsByIds(ids: number[], lang: string): Promise<Excursion[]> {
  const unique = [...new Set(ids.filter((id) => id > 0))];
  if (unique.length === 0) {
    return [];
  }
  const apiUrl = getWpApiBase();
  const res = await fetch(
    `${apiUrl}/wp-json/wp/v2/excursion?include=${unique.join(",")}&_embed&lang=${lang}`,
    { next: { revalidate: 10 } }
  );
  if (!res.ok) {
    return [];
  }
  const data: unknown = await res.json();
  return Array.isArray(data) ? (data as Excursion[]) : [];
}

type Props = { params: Promise<{ lang: string }> };

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const settingsData = getSettings(lang);
  const excursionesData = getExcursiones(lang);

  // Fetch in parallel. Handle excursiones error gracefully to allow render
  const [settings, excursionesResult] = await Promise.allSettled([settingsData, excursionesData]);

  let excursiones = sortExcursionsByTitleAsc(
    excursionesResult.status === 'fulfilled' ? excursionesResult.value : []
  );
  const fetchedSettings = settings.status === 'fulfilled' ? settings.value : {} as Settings;

  const featuredIds = normalizeFeaturedExcursionIds(
    fetchedSettings.featured_excursion_ids
  );

  if (
    featuredIds.length > 0 &&
    excursionesResult.status === 'fulfilled'
  ) {
    const have = new Set(excursiones.map((e) => e.id));
    const missing = featuredIds.filter((id) => !have.has(id));
    if (missing.length > 0) {
      const extra = await fetchExcursionsByIds(missing, lang);
      if (extra.length > 0) {
        const byId = new Map<number, Excursion>();
        for (const e of excursiones) {
          byId.set(e.id, e);
        }
        for (const e of extra) {
          byId.set(e.id, e);
        }
        excursiones = sortExcursionsByTitleAsc([...byId.values()]);
      }
    }
  }

  // Fallback URLs
  const defaultUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx') || '';
  const heroImage = fetchedSettings.home_hero_image || `${defaultUrl}/wp-content/uploads/2026/02/hero.webp`;
  const ctaImage = fetchedSettings.home_cta_image || `${defaultUrl}/wp-content/uploads/2026/02/bannerCTA.webp`;
  const vistazoHImage = fetchedSettings.home_vistazo_h_image || `${defaultUrl}/wp-content/uploads/2026/02/imgIzq.webp`;
  const vistazoVImage = fetchedSettings.home_vistazo_v_image || `${defaultUrl}/wp-content/uploads/2026/02/imgDer.webp`;

  const apiBaseForImages =
    defaultUrl || "https://back.mayaadrenaline.com.mx";
  const popularItems = buildFeaturedExperienceItems(
    featuredIds,
    excursiones,
    apiBaseForImages
  );

  if (excursionesResult.status === 'rejected') {
    console.error("Error loading excursions:", excursionesResult.reason);
    // Optional: Render error state if needed, but for now we proceed with empty list or previous behavior
  }

  const isEn = lang === 'en';
  const t = {
    heroTitle: isEn ? 'History <br /> and Adventure!' : 'Historia <br /> y aventura',
    heroDesc: isEn 
      ? 'Discover the best of Riviera Maya with the unmissable excursions we offer, let yourself be carried away by the incomparable adventure experiences in the Mayan jungle, a totally natural place full of adventure for the ones that enjoy extreme experiences.'
      : 'Descubre lo mejor de la Riviera Maya con las imperdibles excursiones que ofrecemos, déjate llevar por las inigualables experiencias de aventura en la selva maya, un lugar totalmente natural lleno de aventura para los que disfrutan de experiencias extremas.',
    ctaTitle: isEn 
      ? 'We always aim to share the thrill of our experiences and the calm of nature.'
      : 'Siempre nos esforzamos por transmitir la adrenalina de nuestras experiencias y la paz de la naturaleza.',
    ctaQuote: isEn
      ? '“I went to Maya Adrenaline with my whole family, and it was the best decision of my life, we will return.”'
      : '“Fui con toda mi familia a MayaAdrenaline, fue la mejor decision de mi vida, volveremos.”',
    ctaExp: isEn ? 'Full Day Experience' : 'Experiencia Full Day',
    overviewTitle: isEn ? 'A quick overview' : 'Un vistazo rápido',
    overviewDesc: isEn
      ? 'We are a local tourism company with over 10 years of experience operating tours and activities in the Riviera Maya.'
      : 'Somos una empresa de turismo local, con más de 10 años de experiencia operando excursiones y actividades en la Riviera Maya.',
    knowUsBtn: isEn ? 'Learn about us' : 'Conocenos',
    experienceBadge: isEn ? '12 years creating incredible experiences' : '12 años creando experiencias increíbles',
  };


  return (
    <div className="min-h-screen font-sans">
      {/* Header eliminado: manejado por el layout */}

      {/* Sección Hero */}
      <section
        className="bg-black/30 bg-blend-overlay text-white pt-40 pb-20 md:py-20 text-center bg-cover bg-no-repeat min-h-screen flex items-center justify-center flex-col"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="container mx-auto px-4">
          <h2 className="font-nunito md:text-7xl text-5xl font-extrabold mb-8 text-center md:text-left text-white leading-tight" dangerouslySetInnerHTML={{ __html: t.heroTitle }}></h2>
          
          <p className="font-montserrat text-lg md:text-xl text-white mb-16 text-center md:text-left max-w-3xl leading-relaxed opacity-90">
             {t.heroDesc}
          </p>

          <ExperienciasPopulares items={popularItems} lang={lang} />

        </div>
      </section>

      {/* Sección Grid */}
      <main className="container mx-auto px-4 py-12 bg-ma-gris-claro w-full min-h-screen">


        <CarruselExperiencias excursiones={excursiones} lang={lang} />
      </main>



      { /* CTA  */}

      <section className="bg-ma-verdeazul py-24">
        <div className="container mx-auto px-4">
          <h3 className="text-white text-center text-2xl md:text-4xl font-bold mb-16 max-w-5xl mx-auto leading-tight font-nunito">
            {t.ctaTitle}
          </h3>

          <div
            className="w-full max-w-6xl mx-auto bg-white rounded-[20px] md:rounded-[40px] p-8 md:p-20 relative overflow-hidden text-ma-verdeazul shadow-2xl"
            style={{
              backgroundImage: `url('${ctaImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 flex flex-col items-center">
              <p className="text-xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 leading-snug font-nunito">
                {t.ctaQuote}
              </p>

              <div className="w-full flex justify-end">
                <div className="text-right">
                  <p className="font-bold text-lg md:text-xl italic">Andrea Andrada</p>
                  <p className="text-md md:text-lg italic">{t.ctaExp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Vistazo Rápido */}
      <section className="py-24 bg-ma-gris-claro">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda */}
            <div className="flex flex-col gap-8">
              <div className="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-lg">
                <Image
                  src={vistazoHImage}
                  alt="Vista de las instalaciones"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-ma-verdeazul mb-6 font-nunito">
                  {t.overviewTitle}
                </h2>
                <p className="text-lg md:text-xl italic text-ma-verdeazul mb-8 font-montserrat max-w-lg">
                  {t.overviewDesc}
                </p>

                <div className="flex justify-start">
                  <BotonCTA2 text={t.knowUsBtn} href={`/${lang}/nosotros`} />
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="relative w-full h-[600px] md:h-[700px] group">
              {/* Image Container with Mask */}
              <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-lg">
                <Image
                  src={vistazoVImage}
                  alt="Explorando la naturaleza"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Overlay Card - Protruding */}
              <div className="absolute top-12 -right-6 md:-right-12 bg-ma-verde-fondo text-white p-8 md:p-10 rounded-[40px] max-w-[350px] md:max-w-[400px] shadow-2xl z-20">
                <h3 className="text-2xl md:text-4xl font-extrabold leading-tight font-nunito">
                  {t.experienceBadge}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer eliminado: manejado por el layout */}
    </div>
  );
}
