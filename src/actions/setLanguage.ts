'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLanguage(lang: string) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', lang, { 
    maxAge: 60 * 60 * 24 * 365, 
    path: '/',
    secure: true,
    sameSite: 'none'
  });
  revalidatePath('/', 'layout');
}
