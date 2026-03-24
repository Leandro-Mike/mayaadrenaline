import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedExperienceItem } from '@/lib/excursionUtils';

const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 group-hover:opacity-100 transition-opacity">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

type Props = {
    items: FeaturedExperienceItem[];
};

export default function ExperienciasPopulares({ items }: Props) {
    return (
        <div className="bg-black/40 backdrop-blur-md rounded-[2rem] p-6 text-white w-full md:w-[450px] mx-auto md:ml-0 mt-12 md:mt-8 border border-white/10 text-left">
            <h3 className="text-2xl font-nunito font-normal mb-3 text-ma-gris-claro">Experiencias populares</h3>

            {items.length === 0 ? (
                <p className="text-sm font-light text-gray-300 font-montserrat leading-relaxed">
                    Configura hasta tres excursiones destacadas en WordPress (menú <strong>Config. Web</strong>) para mostrarlas aquí.
                </p>
            ) : (
                <div className="flex flex-col space-y-3">
                    {items.map((exp, index) => (
                        <Link key={`${exp.href}-${index}`} href={exp.href} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">

                            {exp.image ? (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={exp.image}
                                        alt={exp.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-lg shrink-0 bg-white/10" aria-hidden />
                            )}

                            <div className="flex-1 text-left">
                                <h4 className="font-bold text-lg font-nunito italic heading-font">{exp.title}</h4>
                                {exp.subtitle ? (
                                    <p className="text-sm font-light text-gray-300 font-montserrat">{exp.subtitle}</p>
                                ) : null}
                            </div>

                            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors shrink-0">
                                <ArrowIcon />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
