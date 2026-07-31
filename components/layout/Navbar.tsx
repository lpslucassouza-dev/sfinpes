"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/compras",
    label: "Compras",
  },
  {
    href: "/projecao",
    label: "Projeção",
  },
  {
    href: "/categorias",
    label: "Categorias",
  },
  {
    href: "/cartoes",
    label: "Cartões",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Controle Financeiro
          </h1>

          <nav className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                    pathname === link.href
                    ? "font-medium text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }
                >
                  {link.label}
              </Link>
         ))}
         </nav>
         </div>
      </div>
    </header>
  );
}
