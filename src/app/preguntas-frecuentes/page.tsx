
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
    const faqsData = getFAQs();
    const settingsData = getSettings();

    // Fallback FAQs hardcoded if API returns empty (optional, but good for empty state)
    const fallbackFaqs = [
        {
            id: 9991,
            title: { rendered: "Â¿Necesito experiencia previa para las actividades?" },
            content: { rendered: "No, nuestras actividades estÃ¡n diseÃ±adas para todos los niveles. Nuestros guÃ­as certificados te darÃ¡n instrucciones detalladas antes de comenzar." }
        },
        {
            id: 9992,
            title: { rendered: "Â¿QuÃ© debo llevar a las excursiones?" },
            content: { rendered: "Recomendamos ropa cÃ³moda, traje de baÃ±o, toalla, cambios de ropa seca, zapatos de agua o tenis que se puedan mojar, repelente biodegradable y protector solar biodegradable." }
        }
    ];

    const [apiFaqs, settings] = await Promise.all([faqsData, settingsData]);

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

                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-[30px] p-8 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-4 flex items-start gap-3">
                                <span className="text-ma-amarillo text-2xl">Q.</span>
                                <span dangerouslySetInnerHTML={{ __html: faq.title.rendered }} />
                            </h3>
                            <div
                                className="font-montserrat text-gray-600 pl-8 leading-relaxed prose prose-sm max-w-none text-justify"
                                dangerouslySetInnerHTML={{ __html: faq.content.rendered }}
                            />
                        </div>
                    ))}

                    <div className="text-center pt-12">
                        <p className="font-montserrat text-gray-600 mb-6">Â¿AÃºn tienes dudas?</p>
                        <div className="flex justify-center">
                            <BotonCTA />
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}


