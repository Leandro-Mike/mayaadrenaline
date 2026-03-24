
'use client';

import { useMemo, useState } from 'react';
import { parseMoney, splitPreciosAdicionalesMenoresYResto } from '@/lib/excursionUtils';

export type PrecioAdicionalRow = {
    etiqueta: string;
    precio: string;
};

interface ReservationFormProps {
    excursionTitle: string;
    excursionPrice: string;
    /** Precio por menor desde WordPress (meta); vacío = usar filas «niño/menor» o precio adulto. */
    precioMenor?: string;
    whatsappNumber: string;
    messageTemplate: string;
    preciosAdicionales?: PrecioAdicionalRow[];
    preciosComplementariosPorPersona?: boolean;
}

export default function ReservationForm({
    excursionTitle,
    excursionPrice,
    precioMenor = '',
    whatsappNumber,
    messageTemplate,
    preciosAdicionales = [],
    preciosComplementariosPorPersona = true,
}: ReservationFormProps) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [minors, setMinors] = useState(0);

    const baseUnit = parseMoney(excursionPrice);
    const metaMinorUnit = parseMoney(precioMenor);

    const { minorRows, otherRows } = useMemo(() => {
        const { menores: mr, resto: otr } =
            splitPreciosAdicionalesMenoresYResto(preciosAdicionales);
        if (parseMoney(precioMenor) > 0) {
            return {
                minorRows: [] as PrecioAdicionalRow[],
                otherRows: [...otr, ...mr],
            };
        }
        return { minorRows: mr, otherRows: otr };
    }, [preciosAdicionales, precioMenor]);

    const minorUnitFromTable = useMemo(
        () =>
            minorRows.reduce((sum, row) => sum + parseMoney(row.precio), 0),
        [minorRows]
    );
    const extrasUnit = useMemo(
        () =>
            otherRows.reduce((sum, row) => sum + parseMoney(row.precio), 0),
        [otherRows]
    );

    const peopleTotal = adults + minors;
    const minorRate =
        metaMinorUnit > 0
            ? metaMinorUnit
            : minorUnitFromTable > 0
              ? minorUnitFromTable
              : baseUnit;

    const {
        totalFormatted,
        adultSub,
        minorSub,
        extrasEnTotal,
    } = useMemo(() => {
        const aSub = adults * baseUnit;
        const mSub = minors * minorRate;
        const extrasPart = preciosComplementariosPorPersona
            ? extrasUnit * peopleTotal
            : extrasUnit;
        const total = aSub + mSub + extrasPart;
        return {
            totalFormatted: Number.isFinite(total) ? total.toFixed(2) : '0',
            adultSub: aSub,
            minorSub: mSub,
            extrasEnTotal: extrasPart,
        };
    }, [
        adults,
        minors,
        baseUnit,
        minorRate,
        extrasUnit,
        peopleTotal,
        preciosComplementariosPorPersona,
    ]);

    const modoEtiqueta = preciosComplementariosPorPersona
        ? 'por persona'
        : 'por reserva';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let message =
            messageTemplate ||
            'Hola, quiero reservar [NombreExcursion] el [Fecha]. Adultos: [adultos], menores: [menores]. Mi nombre es [NombrePersona]. Precio estimado: [precioTotal]';

        message = message.replace('[NombreExcursion]', excursionTitle);
        message = message.replace('[cantidadPersonas]', String(peopleTotal));
        message = message.replace('[adultos]', String(adults));
        message = message.replace('[menores]', String(minors));
        message = message.replace('[NombrePersona]', name);
        message = message.replace('[Fecha]', date);
        message = message.replace('[precio]', baseUnit.toFixed(2));
        message = message.replace('[precioTotal]', totalFormatted);

        message += `\n\nParticipantes: ${adults} adulto(s), ${minors} menor(es) (${peopleTotal} en total).`;

        if (preciosAdicionales.length > 0 || metaMinorUnit > 0) {
            const sufijoOtro = preciosComplementariosPorPersona
                ? ' (complemento por persona)'
                : ' (complemento por reserva, una vez)';
            const sufijoMenor = ' (tarifa por menor)';
            const lineMetaMenor =
                metaMinorUnit > 0
                    ? [
                          `• Precio por menor (excursión): $${metaMinorUnit.toFixed(2)}${sufijoMenor}`,
                      ]
                    : [];
            const linesMenorTabla = minorRows.map(
                (r) =>
                    `• ${r.etiqueta}: $${parseMoney(r.precio).toFixed(2)}${sufijoMenor}`
            );
            const linesOtro = otherRows.map(
                (r) =>
                    `• ${r.etiqueta}: $${parseMoney(r.precio).toFixed(2)}${sufijoOtro}`
            );
            const bloque = [...lineMetaMenor, ...linesMenorTabla, ...linesOtro];
            if (bloque.length > 0) {
                message += '\n\n' + bloque.join('\n');
            }
            message += `\nTotal aprox.: $${totalFormatted}.`;
        } else {
            message += `\n\nTotal aprox.: $${totalFormatted}.`;
        }

        const encodedMessage = encodeURIComponent(message);
        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        const waLink = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
        window.open(waLink, '_blank');
    };

    return (
        <div className="bg-[#0b1d1d] text-white p-8 rounded-[30px] shadow-2xl max-w-md mx-auto relative overflow-hidden">
            <h3 className="text-3xl font-bold font-nunito mb-8 text-center">Haz tu reservación</h3>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Su nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#f4f1e8] text-gray-800 placeholder-gray-500 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat italic"
                        required
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                </div>

                <div className="relative">
                    <div className="w-full bg-[#f4f1e8] text-gray-800 px-6 py-4 rounded-full font-montserrat italic opacity-80 cursor-not-allowed flex items-center justify-between">
                        <span>{excursionTitle}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#f4f1e8] text-gray-800 placeholder-gray-500 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat italic appearance-none"
                        required
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="block text-xs text-ma-gris-claro/90 font-montserrat mb-1.5">Adultos</label>
                        <select
                            value={adults}
                            onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                            className="w-full bg-[#f4f1e8] text-gray-800 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat italic appearance-none cursor-pointer"
                        >
                            {Array.from({ length: 11 }, (_, i) => i)
                                .filter((n) => n >= 1)
                                .map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'adulto' : 'adultos'}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 bottom-3 text-gray-500 pointer-events-none flex flex-col items-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z" /></svg>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="rotate-180"><path d="M12 2L2 22H22L12 2Z" /></svg>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-xs text-ma-gris-claro/90 font-montserrat mb-1.5">Menores</label>
                        <select
                            value={minors}
                            onChange={(e) => setMinors(parseInt(e.target.value, 10))}
                            className="w-full bg-[#f4f1e8] text-gray-800 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat italic appearance-none cursor-pointer"
                        >
                            {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'menor' : 'menores'}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 bottom-3 text-gray-500 pointer-events-none flex flex-col items-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z" /></svg>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="rotate-180"><path d="M12 2L2 22H22L12 2Z" /></svg>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-400 -mt-2 font-montserrat">
                    Total personas: <strong className="text-ma-gris-claro">{peopleTotal}</strong>
                </p>

                {(preciosAdicionales.length > 0 || metaMinorUnit > 0) ? (
                    <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 space-y-3">
                        {metaMinorUnit > 0 ? (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-ma-amarillo mb-1.5">
                                    Precio por menor (excursión)
                                </p>
                                <p className="text-sm text-gray-200 font-montserrat flex justify-between gap-3">
                                    <span>Tarifa por cada menor</span>
                                    <span className="font-medium">${metaMinorUnit.toFixed(2)}</span>
                                </p>
                            </div>
                        ) : null}
                        {minorRows.length > 0 ? (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-ma-amarillo mb-1.5">
                                    Tarifa menores (por cada menor)
                                </p>
                                <ul className="space-y-1.5 text-sm text-gray-200 font-montserrat">
                                    {minorRows.map((row, i) => (
                                        <li key={`m-${row.etiqueta}-${i}`} className="flex justify-between gap-3">
                                            <span>{row.etiqueta}</span>
                                            <span className="shrink-0 font-medium">${parseMoney(row.precio).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        {otherRows.length > 0 ? (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-ma-amarillo mb-1.5">
                                    Complementos ({modoEtiqueta})
                                </p>
                                <ul className="space-y-1.5 text-sm text-gray-200 font-montserrat">
                                    {otherRows.map((row, i) => (
                                        <li key={`o-${row.etiqueta}-${i}`} className="flex justify-between gap-3">
                                            <span>{row.etiqueta}</span>
                                            <span className="shrink-0 font-medium">${parseMoney(row.precio).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        <div className="text-xs text-gray-300 border-t border-white/10 pt-2 mt-1 space-y-1 font-montserrat">
                            <p>
                                Adultos × {adults} × ${baseUnit.toFixed(2)}: <strong>${adultSub.toFixed(2)}</strong>
                            </p>
                            {minors > 0 ? (
                                <p>
                                    Menores × {minors} × ${minorRate.toFixed(2)}
                                    {metaMinorUnit <= 0 && minorUnitFromTable <= 0
                                        ? ' (misma base que adulto)'
                                        : ''}:{' '}
                                    <strong>${minorSub.toFixed(2)}</strong>
                                </p>
                            ) : null}
                            {extrasUnit > 0 ? (
                                <p>
                                    Complementos{preciosComplementariosPorPersona ? ` × ${peopleTotal} pers.` : ''}:{' '}
                                    <strong>${extrasEnTotal.toFixed(2)}</strong>
                                    {!preciosComplementariosPorPersona ? (
                                        <span className="text-gray-400"> (una vez por reserva)</span>
                                    ) : null}
                                </p>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div className="flex items-center justify-between mt-8 pt-4">
                    <div className="flex flex-col">
                        <span className="text-white text-3xl font-bold font-nunito">
                            Total: <span className="text-ma-amarillo">${totalFormatted}</span>
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="bg-white text-black px-6 py-2 rounded-full font-montserrat font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        <span>Reservar</span>
                        <div className="bg-[#25D366] rounded-full p-1 flex items-center justify-center w-6 h-6">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382C17.11 14.196 15.335 13.303 14.996 13.184C14.657 13.065 14.417 13.003 14.17 13.364C13.924 13.725 13.238 14.536 13.024 14.779C12.81 15.022 12.593 15.056 12.231 14.869C11.859 14.678 10.666 14.28 9.255 13.004C8.136 12.001 7.378 10.758 7.16 10.375C6.942 9.993 7.136 9.789 7.317 9.608C7.476 9.449 7.674 9.191 7.854 8.98C8.036 8.769 8.096 8.615 8.217 8.358C8.337 8.1 8.277 7.876 8.182 7.675C8.086 7.475 7.329 5.567 7.02 4.825C6.702 4.09 6.398 4.192 6.173 4.192H5.61C5.398 4.192 5.068 4.276 4.678 4.706C4.288 5.136 3.178 6.182 3.178 8.305C3.178 10.428 4.708 12.483 4.933 12.775C5.145 13.067 7.97 17.475 12.404 19.332C15.228 20.514 15.798 20.301 16.425 20.237C17.447 20.134 19.125 19.227 19.479 18.225C19.833 17.223 19.833 16.365 19.721 16.168C19.609 15.972 19.324 15.869 18.962 15.688L17.472 14.382Z" />
                            </svg>
                        </div>
                    </button>
                </div>

                <div className="text-center text-xs text-gray-400 mt-2">
                    Sera redireccionado a WhatsApp
                </div>

            </form>
        </div>
    );
}
