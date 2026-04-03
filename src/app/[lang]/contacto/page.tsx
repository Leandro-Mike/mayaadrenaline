
import ContactForm from '@/components/ContactForm';
import { Settings } from '@/types/settings';

async function getSettings(): Promise<Settings> {
    const apiUrl = (process.env.WP_BUILD_URL || (process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx') || 'https://back.mayaadrenaline.com.mx');
    try {
        const res = await fetch(`${apiUrl}/wp-json/maya-adrenaline/v1/settings`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {} as Settings;
    }
}

export const metadata = {
    title: 'Contacto - Maya Adrenaline',
    description: 'Ponte en contacto con nosotros para vivir la mejor aventura en la Riviera Maya.',
};

export default async function ContactoPage() {
    const settings = await getSettings();

    // Fallbacks
    const heroImage = settings.contacto_hero_image && settings.contacto_hero_image !== ''
        ? `url('${settings.contacto_hero_image}')`
        : `url('https://dummyimage.com/1920x1080/0b1d1d/ffffff?text=Jungle+Contact')`;

    const email = settings.email || 'info@mayaadrenaline.com';
    const phone = settings.phone || '+52 984 123 4567';
    const address = settings.address || 'Riviera Maya, Quintana Roo, México';

    return (
        <div className="font-sans bg-[#F4F1E8] min-h-screen">

            {/* Hero Section */}
            <section className="relative h-[50vh] w-full mt-[-100px]">
                <div className="absolute inset-0 bg-[#0B1D1D]">
                    {/* Hero Image */}
                    <div
                        className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
                        style={{ backgroundImage: heroImage }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D1D]/90 via-transparent to-black/30"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16 items-center text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-extrabold font-nunito mb-6 drop-shadow-xl uppercase tracking-wider">
                        Hablemos
                    </h1>
                    <div className="w-24 h-1 bg-ma-amarillo rounded-full mb-6"></div>
                    <p className="text-xl font-montserrat font-light max-w-2xl">
                        ¿Tienes dudas o quieres personalizar tu aventura? Estamos aquí para ayudarte.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-3xl font-bold font-nunito text-ma-verdeazul mb-6">Información de Contacto</h3>
                            <p className="font-montserrat text-gray-700 leading-relaxed mb-8">
                                Si prefieres contactarnos directamente, puedes usar los siguientes medios. Respondemos usualmente en menos de 24 horas.
                            </p>

                            <ul className="space-y-6 font-montserrat text-lg text-gray-800">
                                <li className="flex items-center gap-4">
                                    <span className="w-12 h-12 bg-ma-verdeazul text-white rounded-full flex items-center justify-center text-xl"><img src="https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/email-open-svgrepo-com.svg" className="w-6 h-6" alt="" /></span>
                                    <a href={`mailto:${email}`} className="hover:text-ma-amarillo transition-colors">{email}</a>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="w-12 h-12 bg-ma-verdeazul text-white rounded-full flex items-center justify-center text-xl"><img src="https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/phone-alt-svgrepo-com.svg" className="w-6 h-6" alt="" /></span>
                                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-ma-amarillo transition-colors">{phone}</a>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="w-12 h-12 bg-ma-verdeazul text-white rounded-full flex items-center justify-center text-xl"><img src="https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/map-pin-svgrepo-com.svg" className="w-6 h-6" alt="" /></span>
                                    <span>{address}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Component */}
                    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl relative overflow-hidden">
                        <h3 className="text-3xl font-bold font-nunito text-ma-verdeazul mb-8">Envíanos un mensaje</h3>
                        <ContactForm />
                    </div>

                </div>
            </section>

        </div>
    );
}


