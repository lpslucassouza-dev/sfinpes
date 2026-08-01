import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const usuario =
          await prisma.usuario.findFirst({
            where: {
              email: String(
                credentials.email
              ),
            },
          });

        if (!usuario?.senha) {
          return null;
        }

        const senhaValida =
          await bcrypt.compare(
            String(credentials.password),
            usuario.senha
          );

        if (!senhaValida) {
          return null;
        }

        return {
          id: usuario.id.toString(),
          name: usuario.nome,
          email: usuario.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.id as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

});
