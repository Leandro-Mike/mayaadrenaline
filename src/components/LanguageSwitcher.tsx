'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLang = pathname.startsWith('/en') ? 'en' : 'es';

  const switchLanguage = (newLang: string) => {
    if (newLang === currentLang) return;
    
    const segments = pathname.split('/');
    
    // Prevent 404 on single excursion pages due to translated slugs
    if (segments.length >= 4 && segments[2] === 'excursiones') {
      const newPath = `/${newLang}/excursiones`;
      startTransition(() => {
        router.push(newPath);
      });
      return;
    }

    if (segments[1] === 'es' || segments[1] === 'en') {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    const newPath = segments.join('/');

    startTransition(() => {
      router.push(newPath || '/');
    });
  };

  return (
    <div className="flex items-center gap-2 text-white font-montserrat font-semibold text-sm mr-4 md:mr-0 z-50">
      <button 
        onClick={() => switchLanguage('es')}
        className={`transition-colors ${currentLang === 'es' ? 'text-ma-amarillo' : 'hover:text-gray-300'}`}
        disabled={isPending}
      >
        ES
      </button>
      <span className="opacity-50 font-light">|</span>
      <button 
        onClick={() => switchLanguage('en')}
        className={`transition-colors ${currentLang === 'en' ? 'text-ma-amarillo' : 'hover:text-gray-300'}`}
        disabled={isPending}
      >
        EN
      </button>
    </div>
  );
}
