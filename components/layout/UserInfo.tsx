"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
  <div
    className="
      px-4
      py-4
      border-b
      border-slate-700
    "
  >
    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <div
        className="
          w-10
          h-10
          rounded-full
          bg-blue-600
          flex
          items-center
          justify-center
          text-white
          font-bold
        "
      >
        {session?.user?.name
          ?.charAt(0)
          .toUpperCase()}
      </div>

      <div>

        <div className="font-medium">
          {session?.user?.name}
        </div>

        <div
          className="
            text-xs
            text-slate-400
          "
        >
          {session?.user?.email}
        </div>

      </div>

    </div>
  </div>
);
}