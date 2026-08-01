"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  alterarSenhaUsuario,
} from "@/app/usuarios/actions";

type Props = {
  id: number;
  nome: string;
};

export default function ModalSenhaUsuario({
  id,
  nome,
}: Props) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [senha, setSenha] =
    useState("");

  const [confirmacao, setConfirmacao] =
    useState("");

  async function handleSalvar() {

    if (senha !== confirmacao) {
      alert(
        "As senhas não conferem."
      );
      return;
    }

    await alterarSenhaUsuario(
      id,
      senha
    );

    setOpen(false);

    setSenha("");

    setConfirmacao("");

    router.refresh();
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild>

        <button
          className="
            border
            px-3
            py-1
            rounded-lg
            hover:bg-slate-100
          "
        >
          🔑
        </button>

      </Dialog.Trigger>

      <Dialog.Portal>

        <Dialog.Overlay
          className="
            fixed
            inset-0
            bg-black/50
          "
        />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            bg-white
            rounded-2xl
            p-6
            w-full
            max-w-md
          "
        >
          <Dialog.Title
            className="
              text-lg
              font-bold
              mb-4
            "
          >
            Alterar Senha
          </Dialog.Title>

          <p className="mb-4 text-slate-600">
            {nome}
          </p>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Nova senha"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                p-2
              "
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmacao}
              onChange={(e) =>
                setConfirmacao(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                p-2
              "
            />

            <button
              onClick={handleSalvar}
              className="
                w-full
                bg-blue-600
                text-white
                rounded-lg
                p-2
              "
            >
              Alterar Senha
            </button>

          </div>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}