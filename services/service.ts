export interface PositionResult {
  totalCotas: number;
  precoMedio: number;
  diferencaPm: number;
}

export function calcularPosicao(
  transacoes: any[],
  transactionId: string
): PositionResult {

  let quantidadeAtual = 0;
  let custoTotal = 0;

  let resultado = {
    totalCotas: 0,
    precoMedio: 0,
    diferencaPm: 0,
  };

  for (const tx of transacoes) {

    const pmAnterior =
      quantidadeAtual > 0
        ? custoTotal / quantidadeAtual
        : 0;

    if (tx.tipoOperacao === "COMPRA") {

      custoTotal += tx.valorTotal;
      quantidadeAtual += tx.quantidade;

      const novoPm =
        custoTotal / quantidadeAtual;

      if (tx.id === transactionId) {
        resultado = {
          totalCotas: quantidadeAtual,
          precoMedio: Number(
            novoPm.toFixed(2)
          ),
          diferencaPm: Number(
            (novoPm - pmAnterior)
              .toFixed(2)
          ),
        };
      }
    }

    if (tx.tipoOperacao === "VENDA") {

      quantidadeAtual -= tx.quantidade;

      if (tx.id === transactionId) {
        resultado = {
          totalCotas: quantidadeAtual,
          precoMedio: Number(
            pmAnterior.toFixed(2)
          ),
          diferencaPm: 0,
        };
      }
    }
  }

  return resultado;
}