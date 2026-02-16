
'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback } from 'react';

interface GalleryImage {
    id: number;
    url: string;
    alt: string;
}

interface ExcursionGalleryProps {
    images: GalleryImage[];
}

export default function ExcursionGallery({ images }: ExcursionGalleryProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (!images || images.length === 0) return null;

    return (
        <section className="bg-[#0b1d1d] py-20 relative">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl md:text-4xl font-bold font-nunito text-white mb-12 text-center">Algunas vistas</h3>

                <div className="relative group max-w-6xl mx-auto px-12 md:px-20">
                    {/* Carousel Viewport */}
                    <div className="overflow-hidden rounded-[40px]" ref={emblaRef}>
                        <div className="flex">
                            {images.map((img) => (
                                <div className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[600px]" key={img.id}>
                                    <Image
                                        src={img.url}
                                        alt={img.alt || 'Galería'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full p-3 transition-all z-10 backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        onClick={scrollNext}
                        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full p-3 transition-all z-10 backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
