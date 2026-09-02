"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, FolderTree, CreditCard, Users, User, Settings, } from "lucide-react";
import LogoutButton from "./LogoutButton";
import UserInfo from "./UserInfo";
import { useState } from "react";
import { useEffect } from "react";
import { Landmark } from "lucide-react";
import { TrendingUp } from "lucide-react";

const links = [
   {
    href: "/conta-corrente",
    label: "Conta Corrente",
    icon: Landmark,
  },
  {
    href: "/compras",
    label: "Cartões",
    icon: Home,
  },
  {
    href: "/projecao",
    label: "Projeção",
    icon: Calendar,
  },

];

const finnControlLinks = [
  {
    href: "/finncontrol/carteira",
    label: "Carteira",
  },
  {
    href: "/finncontrol/ativos",
    label: "Ativos",
  },
  {
    href: "/finncontrol/lancamentos",
    label: "Lançamentos",
  },
  {
    href: "/finncontrol/consulta-ativos",
    label: "Consulta por Ativo",
  },
  {
    href: "/finncontrol/resumo-mensal",
    label: "Resumo Mensal",
  },
  {
    href: "/acoes",
    label: "Ações",
  },
];

const configuracoesLinks = [
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
];

export default function Sidebar() {
  const pathname = usePathname();

  const [configOpen, setConfigOpen] = useState(false);

  const [finnControlOpen, setFinnControlOpen] = useState(true);

  useEffect(() => {

  setConfigOpen(configuracaoAtiva);

  setFinnControlOpen(
    finnControlAtivo
  );

}, [pathname]);

  const configuracaoAtiva =
          pathname.startsWith("/categorias") ||
          pathname.startsWith("/cartoes") ||
          pathname.startsWith("/usuarios");

  const finnControlAtivo = pathname.startsWith("/finncontrol");

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        w-52
        bg-slate-900
        text-white
        border-r
        border-slate-700
      "
    >
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">
          SFinPes
        </h1>

        <p className="text-slate-400 text-sm">
          Controle Financeiro
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
                  ? "text-white px-4 py-3 rounded-lg font-medium"
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

        <div className="px-3">

            <button
              onClick={() =>
                setFinnControlOpen(
                  !finnControlOpen
                )
              }
              className={`
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-xl
                transition

                ${
                  finnControlAtivo
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `}
            >

              <div className="flex items-center gap-3">

                <TrendingUp size={18} />

                <span>
                  Investimentos
                </span>

              </div>

              <span>
                {finnControlOpen ? "▼" : "▶"}
              </span>

            </button>

            {finnControlOpen && (

              <div className="ml-2 mt-2 flex flex-col gap-1">

                {finnControlLinks.map((link) => {

                  const ativo =
                    pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={
                          ativo
                            ? "flex items-center gap-3 px-3 py-2 ml-6 rounded-lg text-sm transition text-white bg-slate-800"
                            : "flex items-center gap-3 px-3 py-2 ml-6 rounded-lg text-sm transition text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                    >
                      {link.label}
                    </Link>
                  );

                })}
              </div>
            )}
                    
        </div>

        <button
          onClick={() =>
            setConfigOpen(!configOpen)
          }
          className={`
            w-full
            flex
            items-center
            justify-between
            px-4
            py-3
            rounded-xl
            transition

            ${
              configuracaoAtiva
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} />

            <span>Configurações</span>
              </div>

              <span>
                {configOpen ? "▼" : "▶"}
              </span>
            </button>

            {configOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-1">
                {configuracoesLinks.map((link) => {
                  const Icon = link.icon;

                  const ativo =
                    pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2
                        ml-6
                        rounded-lg
                        text-xs
                        transition

                        ${
                          ativo
                            ? "text-white bg-slate-800"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span className="text-sm">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            p-4
            border-t
            border-slate-800
          "
        >

          <Link
            href="/perfil"
            className={
              pathname === "/perfil"
                ? `
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  mb-3
                `
                : `
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  mb-3
                  text-slate-300
                  hover:bg-slate-800
                `
            }
          >
            <User size={18} />
            <span>Meu Perfil</span>
          </Link>


            <LogoutButton />

            <div
              className="
                mt-6
                pt-4
                border-t
                border-slate-800
                text-center
                text-xs
                text-slate-400
              "
            >
              <div className="font-medium">
                SFinPes
              </div>

              <div className="mt-1">
                v1.2.0
              </div>
            </div>
          </div>
    </aside>
    
  );
}