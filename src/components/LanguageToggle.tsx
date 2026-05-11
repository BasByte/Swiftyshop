'use client';

import { useTransition } from 'react';
import { setLanguage } from '@/src/actions/setLanguage';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ currentLang }: { currentLang: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    startTransition(async () => {
      await setLanguage(newLang);
    });
  };

  return (
    <div className="relative flex items-center bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-300 transition-all">
      <div className="absolute inset-s-2 pointer-events-none">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <select
        value={currentLang}
        onChange={handleChange}
        disabled={isPending}
        className="w-full bg-transparent text-xs font-bold border-none py-1.5 ps-7 pe-2 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 appearance-none uppercase"
        title="Select Language"
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
}
