import Link from 'next/link';

import { Settings } from '@/types/settings';

async function getSettings(): Promise<Settings> {
    const apiUrl = process.env.WP_BUILD_URL || process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/wp-json/maya-adrenaline/v1/settings`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
    } catch (error) {
        return {} as Settings;
    }
}

export default async function Footer() {
    const settings = await getSettings();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#1A2C00] text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">

                    {/* Brand / Logo */}
                    <div className="flex flex-col items-center md:items-start justify-center">
                        {/* Assuming the logo includes the stylized text as seen in header */}
                        <Link href="/">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/logo.svg`}
                                alt="Maya Adrenaline"
                                className="w-64 h-auto brightness-0 invert"
                            />
                        </Link>
                    </div>

                    {/* Column 1: Nuestro */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 font-nunito">Nuestro</h4>
                        <ul className="space-y-4 font-montserrat font-light text-gray-300">
                            {settings.social_facebook && (
                                <li><a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-ma-amarillo transition-colors">Facebook</a></li>
                            )}
                            {settings.social_instagram && (
                                <li><a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ma-amarillo transition-colors">Instagram</a></li>
                            )}
                            {settings.social_tiktok && (
                                <li><a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-ma-amarillo transition-colors">TikTok</a></li>
                            )}
                            {settings.social_youtube && (
                                <li><a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="hover:text-ma-amarillo transition-colors">YouTube</a></li>
                            )}
                            <li><Link href="/contacto" className="hover:text-ma-amarillo transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Recursos */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 font-nunito">Recursos</h4>
                        <ul className="space-y-4 font-montserrat font-light text-gray-300">
                            <li><Link href="/" className="hover:text-ma-amarillo transition-colors">Maya Adrenaline</Link></li>
                            <li><Link href="/excursiones" className="hover:text-ma-amarillo transition-colors">Excursiones</Link></li>
                            <li><a href="#" className="hover:text-ma-amarillo transition-colors">Servicios</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Ayuda */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 font-nunito">Ayuda</h4>
                        <ul className="space-y-4 font-montserrat font-light text-gray-300">
                            <li><a href="/preguntas-frecuentes" className="hover:text-ma-amarillo transition-colors">Preguntas Frecuentes</a></li>
                            <li><a href="/precios" className="hover:text-ma-amarillo transition-colors">Precios</a></li>
                            <li><a href="/preguntas-frecuentes" className="hover:text-ma-amarillo transition-colors">Consejos</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#121f00] py-6 mb-0">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm font-montserrat font-light text-gray-400">
                    <div className="mb-2 md:mb-0">
                        Copyright &copy; {year} Maya Adrenaline. All Rights Reserved.
                    </div>
                    <div>
                        Creado por <a href="#" className="hover:text-white transition-colors">MikeWordPress</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
