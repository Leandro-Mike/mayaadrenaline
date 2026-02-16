
import Image from 'next/image';
import BotonCTA from '@/components/botonCTA';

export const metadata = {
    title: 'Nosotros - Maya Adrenaline',
    description: 'Conoce más sobre Maya Adrenaline, una empresa de turismo local con más de 10 años de experiencia en la Riviera Maya.',
};

export default function NosotrosPage() {
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
                        Quiénes Somos
                    </h1>
                    <div className="w-24 h-1 bg-ma-amarillo rounded-full mb-6"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto space-y-12">

                    <div className="prose prose-lg md:prose-xl text-gray-700 font-montserrat leading-relaxed text-center">
                        <p className="mb-8">
                            <span className="font-bold text-ma-verdeazul text-2xl block mb-4">Somos una empresa de turismo local,</span>
                            con más de 10 años de experiencia operando excursiones y actividades en la Riviera Maya, siempre con el afán de buscar los mejores destinos, actividades y atracciones de la zona. Combinamos las mejores actividades al mejor precio para que puedas disfrutar tus vacaciones como nunca.
                        </p>

                        <p>
                            Nuestras excursiones ecoturísticas permiten vivir la adrenalina al máximo, cuidando y disfrutando de la naturaleza que nos rodea, creando así, el balance perfecto entre la <span className="text-ma-verdeazul font-bold">adrenalina de la selva</span>, la <span className="text-ma-verdeazul font-bold">historia de la zona maya</span> y nuestra <span className="text-ma-verdeazul font-bold">hermosa naturaleza</span>.
                        </p>
                    </div>

                    {/* Grid of Values / Highlights (Optional visual enhancement based on text) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        <div className="bg-white p-8 rounded-[30px] shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4">🌿</div>
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2">Ecoturismo</h3>
                            <p className="text-sm font-montserrat text-gray-600">Disfrutando y cuidando la naturaleza.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[30px] shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2">Adrenalina</h3>
                            <p className="text-sm font-montserrat text-gray-600">Experiencias al máximo en la selva.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[30px] shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4">🏛️</div>
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2">Historia</h3>
                            <p className="text-sm font-montserrat text-gray-600">Conexión con la zona Maya.</p>
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
