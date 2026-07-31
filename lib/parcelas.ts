export type ParcelaPreview = {
  numeroParcela: number;
  totalParcelas: number;
  competenciaMes: number;
  competenciaAno: number;
  valorParcela: number;
};

export function gerarParcelas(
  competencia: string,
  valorTotal: number,
  totalParcelas: number
): ParcelaPreview[] {
  if (!competencia || totalParcelas <= 0) {
    return [];
  }

  const [ano, mes] = competencia.split("-").map(Number);

  const valorParcela = Number(
    (valorTotal / totalParcelas).toFixed(2)
  );

  return Array.from(
    { length: totalParcelas },
    (_, index) => {
      const data = new Date(ano, mes - 1 + index);

      return {
        numeroParcela: index + 1,
        totalParcelas,
        competenciaMes: data.getMonth() + 1,
        competenciaAno: data.getFullYear(),
        valorParcela,
      };
    }
  );
}

export function calcularStatusParcela(
  numero: number,
  total: number
) {
  if (total === 1) {
    return "UNICA";
  }

  if (numero === 1) {
    return "INICIO";
  }

  if (numero === total) {
    return "FIM";
  }

  return "CORRENTE";
}