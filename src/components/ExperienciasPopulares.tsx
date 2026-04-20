import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedExperienceItem } from '@/lib/excursionUtils';

type Props = {
    items: FeaturedExperienceItem[];
    lang?: string;
};

export default function ExperienciasPopulares({ items, lang = 'es' }: Props) {
    const isEn = lang === 'en';
    
    return (
        <div className="bg-black/40 backdrop-blur-md rounded-[2rem] p-6 text-white w-full md:w-[450px] mx-auto md:ml-0 mt-12 md:mt-8 border border-white/10 text-left">
            <h3 className="text-2xl font-nunito font-normal mb-3 text-ma-gris-claro">
                {isEn ? 'Popular experiences' : 'Experiencias populares'}
            </h3>

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
                                        alt=""
                                        fill
                                        className="object-cover"
                                        role="presentation"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-lg shrink-0 bg-white/10" aria-hidden />
                            )}

                            <h4 className="flex-1 text-left font-bold text-lg font-nunito italic heading-font">{exp.title}</h4>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
