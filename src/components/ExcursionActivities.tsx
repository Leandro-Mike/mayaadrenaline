
'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

interface Activity {
    id: number;
    name: string;
    description?: string; // Standard WP terms have description
    count?: number; // WP API returns count of usage
    imagen: string | null;
}

interface ExcursionActivitiesProps {
    activities: Activity[];
}

export default function ExcursionActivities({ activities }: ExcursionActivitiesProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', slidesToScroll: 1, loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    useEffect(() => {
        if (!emblaApi) return;

        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
        emblaApi.on('reInit', () => setScrollSnaps(emblaApi.scrollSnapList()));
    }, [emblaApi]);

    if (!activities || activities.length === 0) return null;

    return (
        <section className="bg-[#f4f1e8] py-20 relative">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl md:text-5xl font-bold font-nunito text-ma-verdeazul mb-16">Todo lo que disfrutarás</h3>

                <div className="relative max-w-6xl mx-auto overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-6 pb-12">
                        {activities.map((activity) => (
                            <div
                                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6 flex justify-center"
                                key={activity.id}
                            >
                                <div className="border-2 border-[#0B1D1D] rounded-[30px] p-8 md:p-10 w-full max-w-[400px] h-full flex flex-col items-start text-left bg-transparent transition-all duration-300">
                                    {/* Icon */}
                                    <div className="w-16 h-16 mb-6 relative">
                                        {activity.imagen ? (
                                            <Image
                                                src={activity.imagen}
                                                alt={activity.name}
                                                fill
                                                className="object-contain filter brightness-0"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-[#0B1D1D] rounded-full flex items-center justify-center text-[#F4F1E8] text-xs font-bold">
                                                {activity.name.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-4xl font-extrabold font-nunito text-[#0B1D1D] mb-4 leading-none">{activity.name}</h4>

                                    <p className="font-montserrat text-base text-[#0B1D1D] font-bold leading-snug">
                                        {activity.description || "Una experiencia inolvidable en contacto con la naturaleza y la aventura."}
                                    </p>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all ${index === selectedIndex ? 'bg-ma-verdeazul w-8' : 'bg-ma-verdeazul/30'}`}
                                onClick={() => emblaApi?.scrollTo(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
