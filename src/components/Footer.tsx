import Link from "next/link";
import { dictionaries } from "@/src/lib/dictionaries";
import { getLanguage } from "@/src/lib/getLanguage";

export default async function Footer() {
  const lang = await getLanguage();
  const dict = dictionaries[lang];

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col  items-center justify-between gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity mb-4"
            >
              SWIFT<span className="text-indigo-600">SHOP</span>
            </Link>
            <p className="text-slate-600 font-medium text-sm mb-8">
              {dict.footer.desc}
            </p>
          </div>
          <div className="grid grid-cols-1 align-items-start gap-4 sm:gap-5 justify-items-start text-slate-600 font-medium text-sm ">
            <p className="text-sm font-bold uppercase tracking-widest">
              CONTACT
            </p>
            <div className="text-left wrap-anywhere">
              <p className="mb-2">Tel 1 : 05555555555555 </p>
              <p className="mb-2">Tel 2 : 06666666666666</p>
              <p className="mb-2"> Ouvert du Dimanche au Jeudi de 8h à 16h30</p>
              <p className="mb-2">E-mail : service.client@email.dz</p>
            </div>
          </div>

          <div className="grid grid-cols-1  gap-4 sm:gap-5  text-slate-600 font-medium text-sm ">
            <p className="text-sm font-bold uppercase tracking-widest">
              INFORMATIONS
            </p>
            <div className="text-left wrap-anywhere">
              <p className="mb-2">Adresse : Cité.......... </p>
              <p className="mb-2">Livraison : Disponible vers 58 wilayas</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-400 pt-6 w-full text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} SwiftShop. {dict.footer.rights} •
            Developed by{" "}
            <a
              href=""
              target="_blank"
              className="text-indigo-600 hover:underline"
            >
              Bassyte
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
