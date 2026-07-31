import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Usuários

  await prisma.usuario.createMany({
    data: [
      { nome: "Lucas" },
      { nome: "Taline" },
    ],
    skipDuplicates: true,
  });

  // Cartões

  await prisma.cartao.createMany({
    data: [
      {
        nome: "VISA",
        cashbackPercent: 0,
      },
      {
        nome: "AMEX",
        cashbackPercent: 0,
      },
      {
        nome: "XP",
        cashbackPercent: 1.2,
      },
    ],
    skipDuplicates: true,
  });

  // Categorias

  const categorias = [
    "Alimentação",
    "Combustível",
    "Mercado",
    "Tecnologia",
    "Lazer",
    "Saúde",
    "Casa",
    "Educação",
    "Outros",
  ];

  for (const nome of categorias) {
    await prisma.categoria.upsert({
      where: { nome },
      update: {},
      create: {
        nome,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });