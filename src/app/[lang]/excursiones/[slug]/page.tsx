import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReservationForm from '@/components/ReservationForm';
import ExcursionGallery from '@/components/ExcursionGallery';
import ExcursionActivities from '@/components/ExcursionActivities';
import { stripHtml } from '@/lib/excursionUtils';

interface Excursion {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    precio: string;
    precio_menor?: string;
    tagline: string;
    subtitulo?: string;
    duration: string; // Added duration
    precios_adicionales?: { etiqueta: string; precio: string }[];
    precios_complementarios_por_persona?: boolean;
    servicios_incluidos?: string[];
    informacion_adicional?: { titulo: string; contenido: string }[];
    gallery_images?: { id: number; url: string; alt: string }[];
    _embedded?: {
        "wp:featuredmedia"?: Array<{
            source_url: string;
            alt_text: string;
        }>;
        "wp:term"?: Array<Array<{
            id: number;
            name: string;
            slug: string;
            taxonomy: string;
            description?: string;
            imagen?: string; // From our custom field extension
            _links: any;
        }>>;
    };
    link: string;
}

interface Settings {
    whatsapp_number: string;
    whatsapp_template: string;
}

// Generate Static Params for Static Export
export const dynamicParams = false;

export async function generateStaticParams() {
    const fallbackSlugs = [
        { slug: 'full-day' },
        { slug: 'maya-explosion' },
        { slug: 'tulum-adrenaline' }
    ];

    try {
        console.log(">>> [Build] Generating static params for /excursiones/[slug]");
        const apiUrl = process.env.WP_BUILD_URL || process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx';

        const res = await fetch(`${apiUrl}/wp-json/wp/v2/excursion?per_page=100`, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            console.warn(`>>> [Build] Fetch failed with status: ${res.status}. Using fallbacks.`);
            return fallbackSlugs;
        }

        const posts = await res.json();

        if (!Array.isArray(posts)) {
            console.warn(">>> [Build] Expected array from WP API, got:", typeof posts);
            return fallbackSlugs;
        }

        const slugs = posts
            .filter(post => post && post.slug)
            .map((post: any) => ({
                slug: String(post.slug),
            }));

        console.log(`>>> [Build] Generated ${slugs.length} slugs from API.`);

        // Ensure we always have at least one slug to avoid Next.js "missing" error
        return slugs.length > 0 ? slugs : fallbackSlugs;

    } catch (error) {
        console.error(">>> [Build] Error in generateStaticParams:", error);
        return fallbackSlugs;
    }
}

// Fetch single excursion
async function getExcursion(slug: string, lang: string): Promise<Excursion | null> {
    try {
        const apiUrl = process.env.WP_BUILD_URL || process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx';
        // Ensure to fetch all custom fields if not included by default, but standard REST should include registered fields
        const res = await fetch(`${apiUrl}/wp-json/wp/v2/excursion?slug=${slug}&_embed&lang=${lang}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        const data: Excursion[] = await res.json();
        return data[0] || null;
    } catch (error) {
        console.error("Error fetching excursion:", error);
        // Mock data to prevent build failure
        return {
            id: 0,
            slug: slug,
            title: { rendered: "Excursión (Cargando...)" },
            content: { rendered: "<p>Información no disponible temporalmente.</p>" },
            excerpt: { rendered: "Próximamente" },
            precio: "0",
            tagline: "Aventura",
            duration: "N/A", // Mock duration
            link: "#"
        } as Excursion;
    }
}

// Fetch Settings
async function getSettings(lang: string): Promise<Settings> {
    try {
        const apiUrl = process.env.WP_BUILD_URL || process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx';
        const res = await fetch(`${apiUrl}/wp-json/maya-adrenaline/v1/settings?lang=${lang}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return { whatsapp_number: '', whatsapp_template: '' };
        return res.json();
    } catch (error) {
        console.error("Error settings:", error);
        return { whatsapp_number: '', whatsapp_template: '' };
    }
}

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
    const { slug, lang } = await params;
    const excursion = await getExcursion(slug, lang);

    if (!excursion) {
        return {
            title: 'Excursión no encontrada - Maya Adrenaline'
        };
    }

    const title = excursion.title.rendered.replace(/<[^>]*>?/gm, '');

    return {
        title: `${title} - Maya Adrenaline`,
        description: excursion.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160),
    };
}


export default async function ExcursionPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
    const { slug, lang } = await params;
    const excursionData = getExcursion(slug, lang);
    const settingsData = getSettings(lang);

    const [excursion, settings] = await Promise.all([excursionData, settingsData]);

    if (!excursion) {
        notFound();
    }

    const imageUrl = excursion._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://dummyimage.com/1200x800/e0e0e0/000000.png&text=No+Image";
    const imageAlt = excursion._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || excursion.title.rendered;

    // Extract activities from _embedded
    // wp:term is an array of arrays (one per taxonomy)
    const activities = excursion._embedded?.["wp:term"]?.flat().filter(term => term.taxonomy === 'actividad_excursion') || [];
    // Ensure the interface matches for the component
    const mappedActivities = activities.map(act => ({
        id: act.id,
        name: act.name,
        description: act.description,
        imagen: act.imagen || null
    }));

    const serviciosList = Array.isArray(excursion.servicios_incluidos)
        ? excursion.servicios_incluidos.filter((s) => String(s).trim() !== '')
        : [];
    const infoAdicionalList = Array.isArray(excursion.informacion_adicional)
        ? excursion.informacion_adicional.filter(
              (b) =>
                  String(b?.titulo || '').trim() !== '' ||
                  String(b?.contenido || '').trim() !== ''
          )
        : [];
    const preciosAdicionales = Array.isArray(excursion.precios_adicionales)
        ? excursion.precios_adicionales
        : [];
    const tituloReserva = stripHtml(excursion.title.rendered);
    const preciosComplPorPersona =
        excursion.precios_complementarios_por_persona === false ? false : true;

    return (
        <div className="font-sans bg-[#F4F1E8] min-h-screen">

            {/* Hero Section */}
            <section className="relative h-[85vh] w-full mt-[-100px]">
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white pb-20 pt-32">
                    <h1
                        className="text-5xl md:text-7xl font-extrabold font-nunito mb-6 drop-shadow-lg"
                        dangerouslySetInnerHTML={{ __html: excursion.title.rendered }}
                    />
                    <p className="text-xl md:text-2xl font-medium italic font-montserrat max-w-2xl drop-shadow-md">
                        {excursion.tagline}
                    </p>
                    {excursion.duration && (
                        <div className="mt-8 flex items-center justify-center gap-2 bg-ma-verdeazul/80 backdrop-blur-sm px-6 py-2 rounded-full border border-ma-amarillo">
                            <svg className="w-5 h-5 text-ma-amarillo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-white font-bold uppercase tracking-wider text-sm">{excursion.duration}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content Area */}
            <section className="container mx-auto px-4 py-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Description */}
                    <div className="space-y-8">
                        <h2 
                            className="text-4xl md:text-5xl font-extrabold text-ma-verdeazul font-nunito leading-tight"
                            dangerouslySetInnerHTML={{ __html: excursion.subtitulo || 'Un día <br /> de aventura' }}
                        />

                        <div
                            className="font-montserrat text-lg text-gray-700 leading-relaxed italic space-y-4"
                            dangerouslySetInnerHTML={{ __html: excursion.content.rendered }}
                        />

                        {serviciosList.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="text-2xl font-extrabold text-ma-verdeazul font-nunito not-italic">
                                    Servicios incluidos
                                </h3>
                                <ul className="list-disc list-inside font-montserrat text-base text-gray-800 space-y-2 not-italic">
                                    {serviciosList.map((s, i) => (
                                        <li key={`srv-${i}`}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {infoAdicionalList.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="text-2xl font-extrabold text-ma-verdeazul font-nunito not-italic">
                                    Información adicional
                                </h3>
                                <ul className="list-disc list-inside font-montserrat text-base text-gray-800 space-y-3 not-italic">
                                    {infoAdicionalList.map((b, i) => (
                                        <li key={`info-${i}`} className="leading-relaxed">
                                            {b.titulo ? (
                                                <strong className="text-ma-verdeazul">{b.titulo}</strong>
                                            ) : null}
                                            {b.contenido ? (
                                                <span className="block mt-1 whitespace-pre-line">
                                                    {b.contenido}
                                                </span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>

                    {/* Right Column: Reservation Form */}
                    <div className="lg:sticky lg:top-32">
                        <ReservationForm
                            excursionTitle={tituloReserva}
                            excursionPrice={excursion.precio || '0'}
                            precioMenor={
                                excursion.precio_menor != null &&
                                String(excursion.precio_menor).trim() !== ''
                                    ? String(excursion.precio_menor)
                                    : ''
                            }
                            whatsappNumber={String(settings.whatsapp_number || '+52 984 166 2349')}
                            messageTemplate={String(settings.whatsapp_template || '')}
                            preciosAdicionales={preciosAdicionales}
                            preciosComplementariosPorPersona={preciosComplPorPersona}
                        />
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section>
                <ExcursionGallery images={excursion.gallery_images || []} />
            </section>

            {/* Activities Section */}
            <section>
                <ExcursionActivities activities={mappedActivities} />
            </section>

        </div>
    );
}
