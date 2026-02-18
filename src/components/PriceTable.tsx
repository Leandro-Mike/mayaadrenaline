'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ExcursionPrecio {
    id: number;
    title: string;
    price: string;
    slug: string;
    duration: string; // Added duration
}

interface PriceTableProps {
    initialExcursions: ExcursionPrecio[]; // Updated type
}

export default function PriceTable({ initialExcursions }: PriceTableProps) {
    const [excursions, setExcursions] = useState(initialExcursions);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    const handleSort = () => {
        // ... sort logic (remains same)
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);

        const sorted = [...excursions].sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
            if (isNaN(priceA)) return 1;
            if (isNaN(priceB)) return -1;
            return newOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });

        setExcursions(sorted);
    };

    return (
        <div className="w-full font-montserrat">
            {/* Cabecera para Desktop - oculta en mobile */}
            <div className="hidden md:grid grid-cols-12 bg-ma-verdeazul text-white font-bold uppercase tracking-wider border-b-4 border-ma-amarillo rounded-t-xl overflow-hidden shadow-md">
                <div className="col-span-6 px-6 py-4 text-lg">Excursión</div>
                <div className="col-span-3 px-4 py-4 text-center text-lg">Duración</div>
                <div
                    className="col-span-3 px-6 py-4 text-right text-lg cursor-pointer hover:bg-white/10 transition-colors select-none"
                    onClick={handleSort}
                >
                    <div className="flex items-center justify-end gap-2">
                        <span>Precio</span>
                        <div className="flex flex-col text-[10px] leading-none opacity-70">
                            <span className={sortOrder === 'asc' ? 'text-ma-amarillo' : ''}>▲</span>
                            <span className={sortOrder === 'desc' ? 'text-ma-amarillo' : ''}>▼</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de ordenamiento para mobile */}
            <div className="md:hidden flex justify-end mb-4 px-2">
                <button
                    onClick={handleSort}
                    className="flex items-center gap-2 bg-ma-verdeazul text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
                >
                    <span>Ordenar por Precio</span>
                    <div className="flex flex-col text-[10px] leading-none">
                        <span className={sortOrder === 'asc' ? 'text-ma-amarillo' : 'opacity-40'}>▲</span>
                        <span className={sortOrder === 'desc' ? 'text-ma-amarillo' : 'opacity-40'}>▼</span>
                    </div>
                </button>
            </div>

            <div className="bg-white rounded-xl md:rounded-none md:rounded-b-xl overflow-hidden shadow-sm md:shadow-none divide-y divide-gray-100">
                <AnimatePresence>
                    {excursions.length > 0 ? (
                        excursions.map((exc) => (
                            <motion.div
                                key={exc.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="hover:bg-gray-50 transition-colors group relative"
                            >
                                <Link href={`/excursiones/${exc.slug}`} className="flex flex-col md:grid md:grid-cols-12 w-full items-start md:items-center px-6 py-6 gap-3 md:gap-0">

                                    {/* Título */}
                                    <div className="w-full md:col-span-6 md:pr-4 font-bold md:font-medium text-gray-800 text-xl md:text-lg group-hover:text-ma-verdeazul transition-colors">
                                        <div dangerouslySetInnerHTML={{ __html: exc.title }} />
                                    </div>

                                    {/* Duración */}
                                    <div className="w-full md:col-span-3 md:px-2 text-left md:text-center text-gray-600 font-medium">
                                        {exc.duration && (
                                            <span className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm group-hover:bg-white transition-colors">
                                                <svg className="w-4 h-4 mr-1 text-ma-verdeazul" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {exc.duration}
                                            </span>
                                        )}
                                    </div>

                                    {/* Precio */}
                                    <div className="w-full md:col-span-3 md:pl-4 text-right font-bold text-ma-verdeazul text-xl flex justify-between md:justify-end items-center gap-4">
                                        <div className="md:hidden flex flex-col items-start">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Desde</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="hidden md:block text-[10px] text-gray-400 font-normal uppercase tracking-tighter">por persona</span>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-400 font-normal mr-1">USD</span>
                                                    <span className="text-2xl md:text-xl">${exc.price}</span>
                                                </div>
                                            </div>

                                            {/* Icono de flecha */}
                                            <div className="text-ma-amarillo opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="px-6 py-12 text-center text-gray-500 italic">No hay excursiones disponibles por el momento.</div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
