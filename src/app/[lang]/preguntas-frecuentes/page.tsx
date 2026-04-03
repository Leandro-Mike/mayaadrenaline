
import FAQList from '@/components/FAQList';
import BotonCTA from '@/components/botonCTA';
import { Settings } from '@/types/settings';

export const metadata = {
    title: 'Preguntas Frecuentes - Maya Adrenaline',
    description: 'Resuelve tus dudas sobre nuestras excursiones, pagos y recomendaciones.',
};

interface FAQItem {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
}

async function getFAQs(): Promise<FAQItem[]> {
    const apiUrl = (process.env.WP_BUILD_URL || (process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx') || 'https://back.mayaadrenaline.com.mx');
    try {
        const res = await fetch(`${apiUrl}/wp-json/wp/v2/faq?per_page=100`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
}

async function getSettings(): Promise<Settings> {
    const apiUrl = (process.env.WP_BUILD_URL || (process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx') || 'https://back.mayaadrenaline.com.mx');
    try {
        const res = await fetch(`${apiUrl}/wp-json/maya-adrenaline/v1/settings`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
    } catch (error) {
        return {} as Settings;
    }
}

export default async function FaqPage() {
    const apiFaqsPromise = getFAQs();
    const settingsDataPromise = getSettings();

    // Fallback FAQs hardcoded if API returns empty
    const fallbackFaqs = [
        {
            id: 9991,
            title: { rendered: "¿Necesito experiencia previa para las actividades?" },
            content: { rendered: "No, nuestras actividades están diseñadas para todos los niveles. Nuestros guías certificados te darán instrucciones detalladas antes de comenzar." }
        },
        {
            id: 9992,
            title: { rendered: "¿Qué debo llevar a las excursiones?" },
            content: { rendered: "Recomendamos ropa cómoda, traje de baño, toalla, cambios de ropa seca, zapatos de agua o tenis que se puedan mojar, repelente biodegradable y protector solar biodegradable." }
        }
    ];

    const [apiFaqs, settings] = await Promise.all([apiFaqsPromise, settingsDataPromise]);

    const faqs = apiFaqs.length > 0 ? apiFaqs : fallbackFaqs;

    const heroImage = settings.faq_hero_image && settings.faq_hero_image !== ''
        ? `url('${settings.faq_hero_image}')`
        : `url('https://dummyimage.com/1920x1080/0b1d1d/ffffff?text=FAQ')`;

    return (
        <div className="font-sans bg-[#F4F1E8] min-h-screen">

            {/* Hero Section */}
            <section className="relative h-[50vh] w-full mt-[-100px]">
                <div className="absolute inset-0 bg-[#0B1D1D]">
                    <div
                        className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
                        style={{ backgroundImage: heroImage }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D1D]/90 via-transparent to-black/30"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16 items-center text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-nunito mb-6 drop-shadow-xl uppercase tracking-wider">
                        Preguntas Frecuentes
                    </h1>
                    <div className="w-24 h-1 bg-ma-amarillo rounded-full mb-6"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto space-y-8">

                    <FAQList faqs={faqs} />

                    <div className="text-center pt-12">
                        <p className="font-montserrat text-gray-600 mb-6">¿Aún tienes dudas?</p>
                        <div className="flex justify-center">
                            <BotonCTA />
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}


