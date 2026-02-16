'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    slug: string;
    imagen: string | null;
    count: number;
}

interface Activity {
    id: number;
    name: string;
    slug: string;
    imagen: string | null;
    count: number;
}

interface Excursion {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    categoria_excursion: number[]; // IDs of categories
    actividad_excursion: number[]; // IDs of activities
    _embedded?: {
        "wp:featuredmedia"?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
}

interface ExcursionGridProps {
    excursiones: Excursion[];
    categories: Category[];
    activities: Activity[];
}

export default function ExcursionGrid({ excursiones, categories, activities }: ExcursionGridProps) {
    const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter Logic
    const filteredExcursiones = activeFilter === 'all'
        ? excursiones
        : excursiones.filter(exc =>
            exc.categoria_excursion?.includes(activeFilter) ||
            exc.actividad_excursion?.includes(activeFilter)
        );

    const activeFilterName = activeFilter === 'all'
        ? 'Todas'
        : (categories.find(c => c.id === activeFilter)?.name || activities.find(a => a.id === activeFilter)?.name || 'Todas');


    return (
        <div className='w-full'>
            {/* Header and Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 relative z-30">
                <h2 className="text-4xl font-extrabold text-ma-verdeazul font-nunito">Explora nuestras propuestas</h2>

                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-3 bg-ma-verdeazul text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all font-montserrat italic"
                    >
                        <span>{activeFilter === 'all' ? 'Filtrar' : activeFilterName}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20L12 14L4 4Z" fill="currentColor" opacity="0.5" />
                            <path d="M12 14V20L15 22V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 bg-ma-verde-fondo rounded-[30px] shadow-2xl z-40 p-8 w-[340px] md:w-[600px]"
                            >
                                <h4 className="text-white font-bold font-nunito mb-6 text-lg">Filtrar por:</h4>

                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {/* Categories (With Icons) */}
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setActiveFilter(cat.id); setIsFilterOpen(false); }}
                                            className="flex flex-col items-center gap-2 group w-20"
                                        >
                                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-transparent overflow-hidden relative
                                                ${activeFilter === cat.id ? 'border-ma-amarillo text-ma-amarillo' : 'border-white text-white group-hover:border-ma-amarillo group-hover:text-ma-amarillo'}`}>

                                                {cat.imagen ? (
                                                    <div className="relative w-8 h-8">
                                                        <Image
                                                            src={cat.imagen}
                                                            alt={cat.name}
                                                            fill
                                                            className={`object-contain transition-colors ${activeFilter === cat.id ? '' : 'brightness-0 invert'}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold">{cat.name.substring(0, 2)}</span>
                                                )}
                                            </div>
                                            <span className={`text-xs font-montserrat text-center leading-tight transition-colors ${activeFilter === cat.id ? 'text-ma-amarillo font-bold' : 'text-white'}`}>
                                                {cat.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Divider & Title for Activities */}
                                {(activities.length > 0) && (
                                    <>
                                        <div className="w-full h-px bg-white/20 my-6"></div>
                                        <h5 className="text-white font-bold font-nunito mb-4 text-md opacity-90">Actividades:</h5>
                                    </>
                                )}

                                {/* Activities (With Icons now) */}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {activities.map(act => (
                                        <button
                                            key={act.id}
                                            onClick={() => { setActiveFilter(act.id); setIsFilterOpen(false); }}
                                            className="flex flex-col items-center gap-2 group w-20"
                                        >
                                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-transparent overflow-hidden relative
                                                ${activeFilter === act.id ? 'border-ma-amarillo text-ma-amarillo' : 'border-white text-white group-hover:border-ma-amarillo group-hover:text-ma-amarillo'}`}>

                                                {act.imagen ? (
                                                    <div className="relative w-8 h-8">
                                                        <Image
                                                            src={act.imagen}
                                                            alt={act.name}
                                                            fill
                                                            className={`object-contain transition-colors ${activeFilter === act.id ? '' : 'brightness-0 invert'}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold">{act.name.substring(0, 2)}</span>
                                                )}
                                            </div>
                                            <span className={`text-xs font-montserrat text-center leading-tight transition-colors ${activeFilter === act.id ? 'text-ma-amarillo font-bold' : 'text-white'}`}>
                                                {act.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-end border-t border-white/20 pt-4">
                                    {/* Reset Filter Button */}
                                    <button
                                        onClick={() => { setActiveFilter('all'); setIsFilterOpen(false); }}
                                        className={`text-sm font-montserrat underline transition-colors ${activeFilter === 'all' ? 'text-ma-amarillo font-bold' : 'text-white/70 hover:text-white'}`}
                                    >
                                        Ver todo
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredExcursiones.map(excursion => {
                        const imageUrl = excursion._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                            "https://dummyimage.com/600x800/e0e0e0/000000.png&text=No+Image";
                        const imageAlt = excursion._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || excursion.title.rendered;

                        return (
                            <motion.div
                                key={excursion.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative rounded-[40px] overflow-hidden h-[500px] shadow-lg cursor-pointer bg-[#F4F1E8]" // Using beige bg
                            >
                                <Link href={`/excursiones/${excursion.slug}`} className="block w-full h-full relative">

                                    {/* Top Content (Visible on Hover) */}
                                    <div className="absolute top-0 left-0 w-full h-[45%] p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 z-10 flex flex-col justify-start">
                                        <div className="flex justify-end mb-4">
                                            {/* Arrow Icon - Rotated on hover */}
                                            <div className="bg-white rounded-full p-3 w-12 h-12 flex items-center justify-center shadow-sm">
                                                {/* Using a down/left arrow or rotating the up-right one */}
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/flechaUp.svg`}
                                                    alt="Arrow"
                                                    className="w-5 h-5 rotate-180"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="text-ma-verdeazul text-sm font-montserrat font-medium italic leading-relaxed line-clamp-6"
                                            dangerouslySetInnerHTML={{ __html: excursion.excerpt.rendered }}
                                        />
                                    </div>

                                    {/* Static Arrow for Normal State (Fades out on hover) */}
                                    <div className="absolute top-6 right-6 bg-white rounded-full p-3 w-12 h-12 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 z-20">
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/flechaUp.svg`} alt="Arrow" className="w-5 h-5" />
                                    </div>


                                    {/* Image Wrapper */}
                                    <div className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out group-hover:h-[55%] group-hover:top-[45%] rounded-t-[0px] group-hover:rounded-t-[40px] overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={imageAlt}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-ma-verdeazul/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                        {/* Title Content - Inside Image Wrapper to move with it */}
                                        <div className="absolute bottom-0 left-0 w-full p-8 text-white z-20">
                                            <h3
                                                className="text-3xl font-extrabold font-nunito leading-tight"
                                                dangerouslySetInnerHTML={{ __html: excursion.title.rendered }}
                                            />
                                        </div>
                                    </div>

                                </Link>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {filteredExcursiones.length === 0 && (
                <div className="text-center py-20 opacity-60">
                    <p>No se encontraron excursiones en esta categoría.</p>
                </div>
            )}

        </div>
    );
}
