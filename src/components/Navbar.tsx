import { getSession } from "@/src/lib/auth";
import { getLanguage } from "@/src/lib/getLanguage";
import { dictionaries } from "@/src/lib/dictionaries";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();
  const lang = await getLanguage();
  const dict = dictionaries[lang];

  return (
    <NavbarClient session={session} lang={lang} dict={dict} />
  );
}
