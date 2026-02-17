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
        <div className="overflow-x-auto">
            <table className="w-full text-left font-montserrat table-fixed">
                <thead className="bg-ma-verdeazul text-white font-bold uppercase tracking-wider border-b-4 border-ma-amarillo">
                    <tr>
                        <th className="px-4 py-4 rounded-tl-xl text-lg w-1/2">Excursión</th>
                        <th className="px-4 py-4 text-center text-lg w-1/4">Duración</th>
                        <th
                            className="px-4 py-4 rounded-tr-xl text-lg text-right w-1/4 cursor-pointer hover:bg-white/10 transition-colors select-none"
                            onClick={handleSort}
                        >
                            <div className="flex items-center justify-end gap-2">
                                <span>Precio</span>
                                <div className="flex flex-col text-[10px] leading-none opacity-70">
                                    <span className={sortOrder === 'asc' ? 'text-ma-amarillo' : ''}>▲</span>
                                    <span className={sortOrder === 'desc' ? 'text-ma-amarillo' : ''}>▼</span>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                        {excursions.length > 0 ? (
                            excursions.map((exc) => (
                                <motion.tr
                                    key={exc.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-gray-50 transition-colors group cursor-pointer relative"
                                >
                                    <td className="p-0" colSpan={3}>
                                        <Link href={`/excursiones/${exc.slug}`} className="flex w-full items-center px-4 py-6">

                                            {/* Title Column */}
                                            <div className="w-1/2 pr-4 font-medium text-gray-800 text-lg group-hover:text-ma-verdeazul transition-colors">
                                                <div dangerouslySetInnerHTML={{ __html: exc.title }} />
                                            </div>

                                            {/* Duration Column */}
                                            <div className="w-1/4 px-2 text-center text-gray-600 font-medium">
                                                {exc.duration && (
                                                    <span className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                                                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {exc.duration}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price Column */}
                                            <div className="w-1/4 pl-4 text-right font-bold text-ma-verdeazul text-xl flex justify-end items-center gap-2">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-400 font-normal">por persona</span>
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-400 font-normal mr-1">USD</span>
                                                        <span>${exc.price}</span>
                                                    </div>
                                                </div>

                                                {/* Arrow Icon */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-ma-amarillo flex-shrink-0">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>

                                        </Link>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">No hay excursiones disponibles por el momento.</td>
                            </tr>
                        )}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
