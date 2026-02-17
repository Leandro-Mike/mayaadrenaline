'use client';

import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<null | 'success' | 'error' | 'sending'>(null);
    const [respMessage, setRespMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setRespMessage('');

        try {
            const res = await fetch(`/wp-json/maya-adrenaline/v1/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setRespMessage(data.message || 'Gracias por contactarnos.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
                setRespMessage(data.message || 'Hubo un error. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus('error');
            setRespMessage('Error de conexión. Por favor verifica tu internet.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat placeholder-gray-600"
                    placeholder="Tu nombre completo"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat placeholder-gray-600"
                    placeholder="tucorreo@ejemplo.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Mensaje</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat resize-none placeholder-gray-600"
                    placeholder="¿En qué podemos ayudarte?"
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-ma-verdeazul text-white font-bold font-montserrat py-4 rounded-xl hover:bg-[#0f2424] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
            </button>

            {status === 'success' && (
                <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold font-montserrat mt-4 border border-green-200">
                    {respMessage}
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold font-montserrat mt-4 border border-red-200">
                    {respMessage}
                </div>
            )}

        </form>
    );
}
