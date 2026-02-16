"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BotonCTA from './botonCTA';

export default function Header() {
    const pathname = usePathname();

    return (

        <header className="brightness-100  bg-opacity-20 backdrop-blur-md shadow-sm sticky top-0 z-50 ">

            <div className="container mx-auto px-4 py-4 flex justify-between items-center">

                <div className="flex items-center space-x-6 gap-8">
                    <Link href="/">
                        <img className="w-48" src={`/wp-content/uploads/2026/02/logo.svg`} alt="" />
                    </Link>


                    <nav className=" md:flex space-x-6  gap-8">
                        <Link href="/nosotros" className="font-montserrat font-light text-white transition-colors duration-300 hover:text-ma-amarillo">
                            Conocenos
                        </Link>
                        <Link href="/excursiones" className="font-montserrat font-light text-white transition-colors duration-300 hover:text-ma-amarillo">
                            Experiencias
                        </Link>
                        <Link href="/contacto" className="font-montserrat font-light text-white transition-colors duration-300 hover:text-ma-amarillo">
                            Hablemos
                        </Link>
                        <Link href="/contacto" className="font-montserrat font-light text-white transition-colors duration-300 hover:text-ma-amarillo">
                            Otros servicios
                        </Link>
                    </nav>

                </div>

                <div>
                    <BotonCTA />
                </div>


            </div>
        </header >
    );
}
