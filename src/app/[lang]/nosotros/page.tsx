
import Image from 'next/image';
import BotonCTA from '@/components/botonCTA';

export const metadata = {
    title: 'Nosotros - Maya Adrenaline',
    description: 'Conoce más sobre Maya Adrenaline, una empresa de turismo local con más de 10 años de experiencia en la Riviera Maya.',
};

type Props = { params: Promise<{ lang: string }> };

export default async function NosotrosPage({ params }: Props) {
    const { lang } = await params;
    const isEn = lang === 'en';

    const t = {
        title: isEn ? '¿WHO ARE WE?' : 'Quiénes Somos',
        part1: isEn ? 'We are a local tourism company,' : 'Somos una empresa de turismo local,',
        part2: isEn 
            ? 'with more than 10 years of experience operating excursions and activities in the Riviera Maya, always with the desire to find the best destinations, activities and attractions in the area, we combine the best activities at the best price so that you can enjoy your vacations like never before.'
            : 'con más de 10 años de experiencia operando excursiones y actividades en la Riviera Maya, siempre con el afán de buscar los mejores destinos, actividades y atracciones de la zona. Combinamos las mejores actividades al mejor precio para que puedas disfrutar tus vacaciones como nunca.',
        part3: isEn
            ? 'Our ecotourism excursions allow to experience adrenaline to the fullest, caring for and enjoying the nature that surrounds us, thus creating the perfect balance between the adrenaline of the jungle, the history of the Mayan area and our beautiful nature.'
            : 'Nuestras excursiones ecoturísticas permiten vivir la adrenalina al máximo, cuidando y disfrutando de la naturaleza que nos rodea, creando así, el balance perfecto entre la <span class="text-ma-verdeazul font-bold">adrenalina de la selva</span>, la <span class="text-ma-verdeazul font-bold">historia de la zona maya</span> y nuestra <span class="text-ma-verdeazul font-bold">hermosa naturaleza</span>.',
        ecoTitle: isEn ? 'Ecotourism' : 'Ecoturismo',
        ecoDesc: isEn ? 'Enjoying and caring for nature.' : 'Disfrutando y cuidando la naturaleza.',
        adrenTitle: isEn ? 'Adrenaline' : 'Adrenalina',
        adrenDesc: isEn ? 'Ultimate jungle experiences.' : 'Experiencias al máximo en la selva.',
        histTitle: isEn ? 'History' : 'Historia',
        histDesc: isEn ? 'Connection with the Mayan area' : 'Conexión con la zona Maya.',
    };

    return (
        <div className="font-sans bg-[#F4F1E8] min-h-screen">

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full mt-[-100px]">
                <div className="absolute inset-0 bg-[#0B1D1D]">
                    {/* Placeholder for Hero Image - User should replace this */}
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://dummyimage.com/1920x1080/0b1d1d/ffffff?text=Nature+Background')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D1D]/90 via-transparent to-black/30"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16 items-center text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-extrabold font-nunito mb-6 drop-shadow-xl uppercase tracking-wider">
                        {t.title}
                    </h1>
                    <div className="w-24 h-1 bg-ma-amarillo rounded-full mb-6"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto space-y-12">

                    <div className="prose prose-lg md:prose-xl text-gray-700 font-montserrat leading-relaxed text-center">
                        <p className="mb-8">
                            <span className="font-bold text-ma-verdeazul text-2xl block mb-4">{t.part1}</span>
                            {t.part2}
                        </p>

                        <p dangerouslySetInnerHTML={{ __html: t.part3 }} />
                    </div>

                    {/* Grid of Values / Highlights (Optional visual enhancement based on text) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        <div className="bg-white p-8 rounded-[30px] shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4">🌿</div>
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2">{t.ecoTitle}</h3>
                            <p className="text-sm font-montserrat text-gray-600">{t.ecoDesc}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[30px] shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2">{t.adrenTitle}</h3>
                            <p className="text-sm font-montserrat text-gray-600">{t.adrenDesc}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[30px] shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4">🏛️</div>
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2">{t.histTitle}</h3>
                            <p className="text-sm font-montserrat text-gray-600">{t.histDesc}</p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-12">
                        <BotonCTA />
                    </div>

                </div>
            </section>

        </div>
    );
}
