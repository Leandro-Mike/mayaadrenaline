
import Link from 'next/link';

interface ExcursionPrecio {
    id: number;
    title: string;
    price: string;
}

async function getExcursionPrices(): Promise<ExcursionPrecio[]> {
    try {
        const apiUrl = (process.env.WP_BUILD_URL || (process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx') || 'https://back.mayaadrenaline.com.mx');
        const res = await fetch(`${apiUrl}/wp-json/wp/v2/excursion?per_page=100&_fields=id,title,precio`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) return [];

        const data: any[] = await res.json();
        return data.map((item) => ({
            id: item.id,
            title: item.title.rendered,
            price: item.precio || 'Consultar',
        }));
    } catch (error) {
        console.error("Error fetching prices:", error);
        return [];
    }
}

export const metadata = {
    title: 'Precios - Maya Adrenaline',
    description: 'Consulta los precios de todas nuestras excursiones y aventuras.',
};

import { Settings } from '@/types/settings';

// ... (ExcursionPrecio interface)

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

export default async function PreciosPage() {
    const excursionsData = getExcursionPrices();
    const settingsData = getSettings();

    const [excursions, settings] = await Promise.all([excursionsData, settingsData]);

    const heroImage = settings.precios_hero_image && settings.precios_hero_image !== ''
        ? `url('${settings.precios_hero_image}')`
        : `url('https://dummyimage.com/1920x1080/0b1d1d/ffffff?text=Precios')`;


    return (
        <div className="font-sans bg-[#F4F1E8] min-h-screen">

            {/* Hero Section */}
            <section className="relative h-[50vh] w-full mt-[-100px]">
                <div className="absolute inset-0 bg-[#0B1D1D]">
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: heroImage }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D1D]/90 via-transparent to-black/30"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16 items-center text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-nunito mb-6 drop-shadow-xl uppercase tracking-wider">
                        Lista de Precios
                    </h1>
                    <div className="w-24 h-1 bg-ma-amarillo rounded-full mb-6"></div>
                </div>
            </section>

            {/* Table Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto bg-white rounded-[30px] p-8 md:p-12 shadow-xl overflow-hidden">

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-montserrat">
                            <thead className="bg-ma-verdeazul text-white font-bold uppercase tracking-wider border-b-4 border-ma-amarillo">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl text-lg">ExcursiÃ³n</th>
                                    <th className="px-6 py-4 rounded-tr-xl text-lg text-right">Precio por Persona</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {excursions.length > 0 ? (
                                    excursions.map((exc) => (
                                        <tr key={exc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-6 font-medium text-gray-800 text-lg">
                                                <div dangerouslySetInnerHTML={{ __html: exc.title }} />
                                            </td>
                                            <td className="px-6 py-6 text-right font-bold text-ma-verdeazul text-xl space-x-1">
                                                <span className="text-sm text-gray-400 font-normal mr-1">USD</span>
                                                <span>${exc.price}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500 italic">No hay excursiones disponibles por el momento.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-center text-gray-500 text-sm italic">
                        * Los precios estÃ¡n sujetos a cambios sin previo aviso. ContÃ¡ctanos para mÃ¡s informaciÃ³n o grupos grandes.
                    </div>
                </div>
            </section>

        </div>
    );
}


