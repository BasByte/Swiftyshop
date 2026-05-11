import { cookies } from 'next/headers';

export async function getLanguage(): Promise<'en' | 'fr' | 'ar'> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value;
  return (lang === 'fr') ? 'fr' : (lang === 'ar' ? 'ar' : 'en');
}
