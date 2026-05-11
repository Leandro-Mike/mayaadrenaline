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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://back.mayaadrenaline.com.mx';
            const res = await fetch(`${apiUrl}/wp-json/maya-adrenaline/v1/contact`, {
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

    const isEn = typeof window !== 'undefined' && window.location.pathname.startsWith('/en');

    const t = {
        name: isEn ? 'Name' : 'Nombre',
        email: isEn ? 'Email' : 'Correo Electrónico',
        message: isEn ? 'Message' : 'Mensaje',
        namePlaceholder: isEn ? 'Your full name' : 'Tu nombre completo',
        emailPlaceholder: isEn ? 'youremail@example.com' : 'tucorreo@ejemplo.com',
        msgPlaceholder: isEn ? 'How can we help you?' : '¿En qué podemos ayudarte?',
        btnIdle: isEn ? 'Send Message' : 'Enviar Mensaje',
        btnSending: isEn ? 'Sending...' : 'Enviando...',
        success: isEn ? (respMessage === 'Gracias por contactarnos.' ? 'Thank you for contacting us.' : respMessage) : respMessage,
        error: isEn ? (respMessage === 'Hubo un error. Inténtalo de nuevo.' ? 'There was an error. Please try again.' : respMessage) : respMessage,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">{t.name}</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat placeholder-gray-600 text-gray-900"
                    placeholder={t.namePlaceholder}
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">{t.email}</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat placeholder-gray-600 text-gray-900"
                    placeholder={t.emailPlaceholder}
                    required
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">{t.message}</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ma-amarillo transition-all font-montserrat resize-none placeholder-gray-600 text-gray-900"
                    placeholder={t.msgPlaceholder}
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-ma-verdeazul text-white font-bold font-montserrat py-4 rounded-xl hover:bg-[#0f2424] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {status === 'sending' ? t.btnSending : t.btnIdle}
            </button>

            {status === 'success' && (
                <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold font-montserrat mt-4 border border-green-200">
                    {t.success}
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold font-montserrat mt-4 border border-red-200">
                    {t.error}
                </div>
            )}

        </form>
    );
}
