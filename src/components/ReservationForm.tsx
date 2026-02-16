
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ReservationFormProps {
    excursionTitle: string;
    excursionPrice: string;
    whatsappNumber: string;
    messageTemplate: string;
}

export default function ReservationForm({ excursionTitle, excursionPrice, whatsappNumber, messageTemplate }: ReservationFormProps) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [people, setPeople] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Process the template variables
        let message = messageTemplate || "Hola, quiero reservar [NombreExcursion] para [cantidadPersonas] personas el [Fecha]. Mi nombre es [NombrePersona]."; // fallback

        message = message.replace('[NombreExcursion]', excursionTitle);
        message = message.replace('[cantidadPersonas]', people.toString());
        message = message.replace('[NombrePersona]', name);
        message = message.replace('[Fecha]', date);
        message = message.replace('[precio]', excursionPrice);

        // 2. Encode for URL
        const encodedMessage = encodeURIComponent(message);

        // 3. Redirect to WhatsApp
        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        const waLink = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
        window.open(waLink, '_blank');
    };

    const totalPrice = parseFloat(excursionPrice) * people;

    return (
        <div className="bg-[#0b1d1d] text-white p-8 rounded-[30px] shadow-2xl max-w-md mx-auto relative overflow-hidden">
            <h3 className="text-3xl font-bold font-nunito mb-8 text-center">Haz tu reservación</h3>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name Input */}
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

                {/* Excursion Name (Read-only styled) */}
                <div className="relative">
                    <div className="w-full bg-[#f4f1e8] text-gray-800 px-6 py-4 rounded-full font-montserrat italic opacity-80 cursor-not-allowed flex items-center justify-between">
                        <span>{excursionTitle}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </div>
                </div>

                {/* Date Input */}
                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#f4f1e8] text-gray-800 placeholder-gray-500 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat italic appearance-none"
                        required
                    />
                    {/* Only show icon if browser doesn't enforce its own, but styling date inputs is tricky. This icon is decorative. */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                </div>

                {/* People Count */}
                <div className="relative">
                    <select
                        value={people}
                        onChange={(e) => setPeople(parseInt(e.target.value))}
                        className="w-full bg-[#f4f1e8] text-gray-800 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat italic appearance-none cursor-pointer"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num} persona{num > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex flex-col items-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z" /></svg>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="rotate-180"><path d="M12 2L2 22H22L12 2Z" /></svg>
                    </div>
                </div>

                {/* Total & Submit */}
                <div className="flex items-center justify-between mt-8 pt-4">
                    <div className="flex flex-col">
                        <span className="text-white text-3xl font-bold font-nunito">Total: <span className="text-ma-amarillo">${isNaN(totalPrice) ? '0' : totalPrice}</span></span>
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
