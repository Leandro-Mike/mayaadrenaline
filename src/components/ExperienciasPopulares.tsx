import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 group-hover:opacity-100 transition-opacity">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ExperienciasPopulares() {
    const experiences = [
        {
            title: "Full Day",
            subtitle: "Aventura y diversión de la selva.",
            href: "/excursiones",
            image: `${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/imgIzq.webp`
        },
        {
            title: "Maya Explosion",
            subtitle: "Aventura y diversión de la selva.",
            href: "/excursiones",
            image: `${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/imgDer.webp`
        },
        {
            title: "Tulum Adrenaline",
            subtitle: "Aventura y diversión de la selva.",
            href: "/excursiones"
        }
    ];

    return (
        <div className="bg-black/40 backdrop-blur-md rounded-[2rem] p-6 text-white max-w-lg w-[450px] ml-auto mt-8 border border-white/10 text-left">
            <h3 className="text-2xl font-nunito font-normal mb-3 text-ma-gris-claro">Experiencias populares</h3>

            <div className="flex flex-col space-y-3">
                {experiences.map((exp, index) => (
                    <Link key={index} href={exp.href} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">

                        {/* Image (Optional) */}
                        {exp.image && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <Image
                                    src={exp.image}
                                    alt={exp.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="flex-1 text-left">
                            <h4 className="font-bold text-lg font-nunito italic heading-font">{exp.title}</h4>
                            <p className="text-sm font-light text-gray-300 font-montserrat">{exp.subtitle}</p>
                        </div>

                        <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors shrink-0">
                            <ArrowIcon />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}