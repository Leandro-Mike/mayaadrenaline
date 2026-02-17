'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
}

export default function FAQList({ faqs }: { faqs: FAQItem[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="space-y-6">
            {faqs.map((faq, index) => (
                <div
                    key={faq.id}
                    className="bg-white rounded-[30px] shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                >
                    <div className="p-8 flex items-start gap-4">
                        <div className="w-12 h-12 bg-ma-verdeazul text-white rounded-full flex items-center justify-center text-xl shrink-0">
                            <img
                                src="https://back.mayaadrenaline.com.mx/wp-content/uploads/2026/02/question-svgrepo-com.svg"
                                alt="Question Icon"
                                className="w-6 h-6 invert brightness-0"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold font-nunito text-ma-verdeazul mb-2 flex items-center justify-between">
                                <span dangerouslySetInnerHTML={{ __html: faq.title.rendered }} />
                                <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </h3>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div
                                            className="font-montserrat text-gray-600 leading-relaxed prose prose-sm max-w-none text-justify mt-4"
                                            dangerouslySetInnerHTML={{ __html: faq.content.rendered }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
