'use client'
import Link from 'next/link'
import BotonCTA2 from './botonCTA2';
import './CarruselExperiencias.css'
import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'

// Definir la forma de los datos de Excursión desde la API de WP
export interface Excursion {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    precio: string; // El campo personalizado que añadimos
    tagline: string; // El campo personalizado que añadimos
    _embedded?: {
        "wp:featuredmedia"?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
    link: string;
}

export default function Carousel({ excursiones }: { excursiones: Excursion[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: true, stopOnMouseEnter: true })]
    )

    const scrollPrev = useCallback(() => {
        if (!emblaApi) return
        const autoScroll = emblaApi.plugins().autoScroll
        if (autoScroll && autoScroll.isPlaying()) autoScroll.stop()
        emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (!emblaApi) return
        const autoScroll = emblaApi.plugins().autoScroll
        if (autoScroll && autoScroll.isPlaying()) autoScroll.stop()
        emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <div className="container mx-auto flex flex-col md:flex-row items-center min-h-[90vh] bg-ma-gris-claro w-full px-4 py-12 md:py-0">

            <div className="w-full md:w-[40%] flex flex-col justify-center items-center md:items-start text-center md:text-left p-4 md:p-8 space-y-6 md:space-y-8 mb-8 md:mb-0">
                <h2 className="font-nunito text-4xl md:text-5xl lg:text-7xl font-extrabold text-ma-verde-fondo leading-tight">
                    MUCHAS<br />EMOCIONES<br />EN UN SOLO<br />LUGAR
                </h2>
                <BotonCTA2 href="/excursiones" />
            </div>


            <div className="embla w-full md:w-[60%] h-full flex flex-col justify-center relative md:pl-8 pb-16 md:pb-0">
                {/* Navigation Buttons */}
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:-top-12 md:right-10 z-10 flex gap-4 justify-end'>
                    <button className="embla__prev cursor-pointer bg-white rounded-full p-3 hover:scale-110 transition-transform shadow-sm" onClick={scrollPrev}>
                        <img className='w-6 h-6 opacity-60' src={`https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/flechaPrev.svg`} alt="Prev" />
                    </button>

                    <button className="embla__next cursor-pointer bg-white rounded-full p-3 hover:scale-110 transition-transform shadow-sm" onClick={scrollNext}>
                        <img className='w-6 h-6 opacity-60' src={`https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/flechaNext.svg`} alt="Next" />
                    </button>
                </div>

                <div className="embla__viewport h-[450px] md:h-[600px] w-full overflow-hidden" ref={emblaRef}>
                    <div className="embla__container h-full items-center flex">
                        {excursiones.map((excursion, index) => {
                            const imageUrl =
                                excursion._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                                "https://dummyimage.com/600x400/cccccc/000000.png&text=No+Image";

                            const imageAlt = excursion._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || excursion.title.rendered;

                            return (
                                <article
                                    key={excursion.id}
                                    className={`embla__slide relative flex-[0_0_100%] md:flex-[0_0_45%] md:mx-4 h-[400px] md:h-[500px] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ease-out group ${index % 2 === 0 ? 'mt-0' : 'md:mt-24 mt-0'}`}
                                >
                                    <Link href={`/excursiones/${excursion.slug}`} className="absolute inset-0 z-20" aria-label={`Ver ${excursion.title.rendered}`}>
                                        <span className="sr-only">Ver {excursion.title.rendered}</span>
                                    </Link>

                                    <Image
                                        src={imageUrl}
                                        alt={imageAlt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 33vw"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                    {/* Text Content */}
                                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-8 md:right-8 text-white z-10 pointer-events-none">
                                        <div className="w-12 h-1 md:w-16 bg-white mb-3 md:mb-4 rounded-full"></div>
                                        <h3
                                            className="text-2xl md:text-4xl font-extrabold font-nunito mb-2 leading-tight"
                                            dangerouslySetInnerHTML={{ __html: excursion.title.rendered }}
                                        />
                                        <p className="font-montserrat font-light text-xs md:text-sm italic opacity-90 line-clamp-2">
                                            {excursion.tagline || "Aventura y diversión de la selva."}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}
