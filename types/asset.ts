export interface Asset {
  id: string;
  ticker: string;
  name: string;

  type:
    | "STOCK"
    | "FII"
    | "CRYPTO"
    | "ETF"
    | "BDR";

  currentPrice: number;
  active: boolean;

  createdAt: string;
  updatedAt: string;
}