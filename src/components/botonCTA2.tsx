interface BotonCTA2Props {
    text?: string;
    href?: string;
}

export default function BotonCTA2({ text = "Reservar", href = "#" }: BotonCTA2Props) {
    return (
        <a href={href} className="flex items-center gap-4 group transition-all hover:scale-105">
            <span className="text-xl bg-ma-verde-fondo text-ma-gris-claro border border-ma-verde-fondo px-10 py-3 rounded-full font-montserrat font-light italic tracking-wider transition-colors group-hover:bg-opacity-90">
                {text}
            </span>
            <div className="bg-white rounded-full p-3 shadow-md w-14 h-14 flex items-center justify-center transition-transform group-hover:rotate-45">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/wp-content/uploads/2026/02/flechaUp.svg`} alt="Arrow" className="w-6 h-6" />
            </div>
        </a>
    );
}
