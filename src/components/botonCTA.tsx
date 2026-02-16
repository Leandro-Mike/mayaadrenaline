import Link from 'next/link';

export default function BotonCTA() {
    return (
        <Link href="/excursiones" className="flex items-center gap-2 text-white rounded-full transition-all hover:scale-105">
            <span className="text-lg bg-white text-black px-6 py-1 rounded-full font-montserrat font-light italic">Reservar</span>
            <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/flechaUp.svg`} alt="Arrow" className="w-5 h-5" />
            </div>
        </Link>
    );
}
