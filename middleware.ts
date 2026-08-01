export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/compras/:path*",
    "/categorias/:path*",
    "/cartoes/:path*",
    "/projecao/:path*",
  ],
};