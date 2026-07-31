import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  const password =
    await bcrypt.hash(
      "SuaSenhaForte123",
      10
    );

  await prisma.user.create({
    data: {
      name: "Lucas",
      email: "seu-email@gmail.com",
      password,
    },
  });

  console.log(
    "Usuário criado."
  );
}

main();