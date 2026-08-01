"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, FolderTree, CreditCard, Users, User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import UserInfo from "./UserInfo";

const links = [
  {
    href: "/compras",
    label: "Compras",
    icon: Home,
  },
  {
    href: "/projecao",
    label: "Projeção",
    icon: Calendar,
  },
  {
    href: "/categorias",
    label: "Categorias",
    icon: FolderTree,
  },
  {
    href: "/cartoes",
    label: "Cartões",
    icon: CreditCard,
  },
  {
    href: "/usuarios",
    label: "Usuários",
    icon: Users,
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        h-screen
        w-56
        bg-slate-900
        text-white
        border-r
        border-slate-700
      "
    >
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">
          Controle
        </h1>

        <p className="text-slate-400 text-sm">
          Financeiro
        </p>

        <UserInfo />
        
      </div>

      <nav className="p-3 flex flex-col gap-2">
        {links.map((link) => {

          const Icon = link.icon;

            return (
            <Link
              key={link.href}
              href={link.href}
              className={
                  pathname === link.href
                  ? "bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition"
              }
            >
            <div className="flex items-center gap-3">
              <Icon size={18} />
              <span>{link.label}</span>
            </div>
            </Link>
            );
        })}
        </nav>

        <div className="absolute bottom-4 left-4 text-xs text-slate-500">
          Controle Financeiro
          <br />
          Versão 1.0
        </div>

        <div className="absolute bottom-6 left-4 right-4">
          <LogoutButton />
        </div>

    </aside>
    
  );
}