"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  alterarMinhaSenha,
} from "@/app/perfil/actions";

export default function ModalTrocarSenha() {

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

    await alterarMinhaSenha(
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
            bg-amber-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Alterar Senha
        </button>

      </Dialog.Trigger>

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
              bg-green-600
              text-white
              rounded-lg
              p-2
            "
          >
            Salvar Senha
          </button>

        </div>

      </Dialog.Content>

    </Dialog.Root>
  );
}