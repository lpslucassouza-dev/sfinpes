import { DcfRow } from "./types";

export class ValuationService {
  
  static calculateGrowth(
    current: number,
    previous: number
  ) {
    if (!previous) return 0;

    return (
      ((current - previous) / previous) *
      100
    );
  }

  static calculateGrowthRate(
    roe: number,
    payout: number
  ) {
    return roe * (1 - payout / 100);
  }

  static calculateMarketCap(
    precoAtual: number,
    totalAcoes: number
  ) {
    return precoAtual * totalAcoes;
  }

  static calculateFairPrice(
    marketCap: number,
    totalAcoes: number
  ) {
    if (!totalAcoes) return 0;

    return marketCap / totalAcoes;
  }

  static calculateUpside(
    fairPrice: number,
    currentPrice: number
  ) {
    if (!currentPrice) return 0;

    return (
      ((fairPrice - currentPrice) /
        currentPrice) *
      100
    );
  }

static calculateVPL(
  fluxo: number,
  taxaDesconto: number,
  periodo: number
) {
  return (
    fluxo /
    Math.pow(
      1 + taxaDesconto / 100,
      periodo
    )
  );
}

static calculateTerminalValue(
  ultimoLucro: number,
  crescimentoPerpetuo: number,
  taxaDesconto: number
) {

  const g =
    crescimentoPerpetuo / 100;

  const d =
    taxaDesconto / 100;

  {/* (E10/((1+B7)/(1+F13)-1)) 
    ( ultimoLucro / (( 1 + taxaDesconto) / ( 1 + crescimentoPerpetuo) - 1))
    */}

  return (

    (ultimoLucro / (( 1 + d ) / ( 1 + g ) - 1 ))

  );
}

static calculatePerpetualVPL(
  valorTerminal: number,
  taxaDescontoPerpetua: number
) {
  return (
    valorTerminal /
    Math.pow(
      (1 + (taxaDescontoPerpetua / 100)), 3
      )
    );
}

static calculateValuation({
  rows,
  taxaDesconto,
  crescimentoPerpetuo,
  taxaDescontoPerpetua,
  precoAtual,
  totalAcoes,
}: {
  rows: DcfRow[];

  taxaDesconto: number;

  crescimentoPerpetuo: number;

  taxaDescontoPerpetua: number;

  precoAtual: number;

  totalAcoes: number;
}) {

  const currentYear =
  new Date().getFullYear();

  const projectedRows =
    rows.filter(
      (row) => row.ano >= currentYear
    );

  const calculatedRows =
    projectedRows.map(
      (row, index) => {

        const vpl =
          this.calculateVPL(
            row.lucroLiquido,
            taxaDesconto,
            index + 1
          );

        return {
          ...row,
          vpl,
        };
      }
    );  

  const ultimoLucro =
    calculatedRows[
      calculatedRows.length - 1
    ]?.lucroLiquido || 0;

  const valorTerminal =
    this.calculateTerminalValue(
      ultimoLucro,
      crescimentoPerpetuo,
      taxaDesconto
    );

  const vplPerpetuo =
    this.calculatePerpetualVPL(
      valorTerminal,
      taxaDescontoPerpetua
    );

  const vplTotal =
    calculatedRows.reduce(
      (acc, row) => acc + row.vpl,
      0
    );

  const marketCapProjetado =
    vplTotal +
    vplPerpetuo;

  const precoJusto =
    totalAcoes > 0
      ? marketCapProjetado /
        totalAcoes
      : 0;  

  const upsideDownside =
    precoAtual > 0
      ? (
          (
            precoJusto -
            precoAtual
          ) /
          precoAtual
        ) * 100
      : 0;

  return {
    
    rows: calculatedRows,

    vplTotal,

    valorTerminal,

    vplPerpetuo,

    marketCapProjetado,

    precoJusto,

    upsideDownside,
  };
  }
}