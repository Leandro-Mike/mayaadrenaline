import Image from "next/image";
import { notFound } from "next/navigation";

// Define the shape of the Excursion data (same as grid for consistency)
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
    tagline: string;
    _embedded?: {
        "wp:featuredmedia"?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
    link: string;
}

// Generate Static Params for Static Export
export async function generateStaticParams() {
    try {
        // Use build-time URL (local) if available, otherwise public URL, with explicit fallback
        const apiUrl = process.env.WP_BUILD_URL || process.env.NEXT_PUBLIC_API_URL || 'https://mayaadrenaline.com.mx';
        const posts = await fetch(`${apiUrl}/wp-json/wp/v2/excursion?per_page=100`).then((res) => res.json());
        return posts.map((post: any) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        // Fallback slugs to ensure build passes currently
        return [
            { slug: 'full-day' },
            { slug: 'maya-explosion' },
            { slug: 'tulum-adrenaline' }
        ];
    }
}

async function getExcursion(slug: string): Promise<Excursion | null> {
    const apiUrl = process.env.WP_BUILD_URL || process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/wp-json/wp/v2/excursion?slug=${slug}&_embed`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data.length > 0 ? data[0] : {
        id: 0,
        slug: slug,
        title: { rendered: "Excursión" },
        content: { rendered: "Contenido no disponible" },
        excerpt: { rendered: "..." },
        precio: "0",
        tagline: "",
        link: "#"
    };
}

export default async function ExcursionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const excursion = await getExcursion(slug);

    if (!excursion) {
        notFound();
    }

    const imageUrl =
        excursion._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://dummyimage.com/1200x600/cccccc/000000.png&text=No+Image";

    const imageAlt = excursion._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || excursion.title.rendered;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
            {/* Header (Simplified) */}
            {/* Header removed: handled by layout */}

            {/* Hero / Header Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end pb-12 px-4">
                    <div className="container mx-auto text-white">
                        {excursion.tagline && (
                            <span className="bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                                {excursion.tagline}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg" dangerouslySetInnerHTML={{ __html: excursion.title.rendered }} />
                        {excursion.precio && (
                            <p className="text-2xl md:text-3xl font-semibold text-orange-400">
                                ${excursion.precio} <span className="text-lg text-gray-300 font-normal">/ persona</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Content Column */}
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Detalles de la Excursión</h2>
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: excursion.content.rendered }}
                    />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg sticky top-24">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reserva tu lugar</h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">Consulta disponibilidad y asegura tu aventura hoy mismo.</p>

                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg mb-4 shadow-lg active:scale-95 transform duration-100">
                            Reservar Ahora
                        </button>

                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
                            <p><strong>Duración:</strong> Consultar</p>
                            <p><strong>Incluye:</strong> Guía, Seguro, Snack</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            {/* Footer removed: handled by layout */}

        </div>
    );
}
