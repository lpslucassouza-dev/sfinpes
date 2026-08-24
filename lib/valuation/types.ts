export interface DcfRow {
  ano: number;
  lucroLiquido: number;
  crescimento: number;
}

export interface ValuationResult {
  marketCap: number;
  precoPorAcao: number;
  upsideDownside: number;
} 

export interface DcfCalculation {
  ano: number;
  lucroLiquido: number;
  crescimento: number;
  vpl: number;
}

export interface ValuationCalculationResult {
  rows: DcfCalculation[];

  vplTotal: number;

  valorTerminal: number;

  vplPerpetuo: number;

  marketCapProjetado: number;

  precoJusto: number;

  upsideDownside: number;
}