export function calcularResumo(parcelas: any[]) {
  const totalMes = parcelas.reduce(
    (acc, item) =>
      acc + Number(item.valorParcela),
    0
  );

  const cashbackMes = parcelas.reduce(
    (acc, item) =>
      acc + Number(item.cashback),
    0
  );

  const iniciando = parcelas
    .filter(
      (item) =>
        item.statusParcela === "INICIO"
    )
    .reduce(
      (acc, item) =>
        acc + Number(item.valorParcela),
      0
    );

  const encerrando = parcelas
    .filter(
      (item) =>
        item.statusParcela === "FIM"
    )
    .reduce(
      (acc, item) =>
        acc + Number(item.valorParcela),
      0
    );

  return {
    totalMes,
    cashbackMes,
    iniciando,
    encerrando,
  };
}