"use client";

import SearchBar from "./SearchBar";
import MetricCards from "./MetricCards";
import PremissasCard from "./PremissasCard";
import RealidadeProjetadaCard from "./RealidadeProjetadaCard";
import DcfTable from "./DcfTable";
import AnnotationsCard from "./AnnotationsCard";
import { useState } from "react";
import { ValuationService } from "@/lib/valuation/services";

export default function FormValuation() {

const [precoAtual, setPrecoAtual]     = useState(0);
const [totalAcoes, setTotalAcoes]     = useState(0);
const [payout, setPayout]             = useState(0);
const [roe, setRoe]                   = useState(0);
const [taxaDesconto, setTaxaDesconto] = useState(15);
const [taxaDescontoPerpetua,setTaxaDescontoPerpetua,] = useState(10);
const [crescimentoPerpetuo,setCrescimentoPerpetuo,] = useState(3);
const currentYear = new Date().getFullYear();

const [dcfRows, setDcfRows] =
    useState([
      {
        ano: currentYear - 3,
        lucroLiquido: 0,
        crescimento: 0,
      },
      {
        ano: currentYear - 2,
        lucroLiquido: 0,
        crescimento: 0,
      },
      {
        ano: currentYear - 1,
        lucroLiquido: 0,
        crescimento: 0,
      },
      {
        ano: currentYear,
        lucroLiquido: 0,
        crescimento: 0,
      },
      {
        ano: currentYear + 1,
        lucroLiquido: 0,
        crescimento: 0,
      },
      {
        ano: currentYear + 2,
        lucroLiquido: 0,
        crescimento: 0,
      },
    ]);

  const marketCap =
    ValuationService.calculateMarketCap(
      precoAtual,
      totalAcoes
    );

  const taxaCrescimento =
    ValuationService.calculateGrowthRate(
      roe,
      payout
    );

  const precoPorAcao =
    ValuationService.calculateFairPrice(
      marketCap,
      totalAcoes
    );  

  const upsideDownside =
    ValuationService.calculateUpside(
      precoPorAcao,
      precoAtual
    );

  function handleReset() {
    setPrecoAtual(0);

    setTotalAcoes(0);

    setPayout(0);

    setRoe(0);

    setDcfRows(
      dcfRows.map((row) => ({
        ...row,
        lucroLiquido: 0,
        crescimento: 0,
      }))
    );
  }

  const valuation =
    ValuationService.calculateValuation({
      rows: dcfRows,
      taxaDesconto,
      crescimentoPerpetuo,
      taxaDescontoPerpetua,
      precoAtual,
      totalAcoes,
    });

  const [ticker, setTicker] =
    useState("");

  
{/*    
    function handleSave() {
      console.log("Salvar valuation");

      console.log({
        ticker,
        precoAtual,
        precoJusto: valuation.precoJusto,
        upside: valuation.upsideDownside,
      });
    }
*/}

async function handleSave() {
  try {

    {/* 
    console.log({
      ticker,
      precoAtual,
      totalAcoes,
      });
    */}

    const response = await fetch(
      "/api/valuation",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ticker,

          precoAtual,

          precoJusto:
            valuation.precoJusto,

          upsideDownside:
            valuation.upsideDownside,

          totalAcoes,

          payout,

          roe,

          taxaDesconto,

          taxaDescontoPerpetua,

          crescimentoPerpetuo,

          marketCapProjetado:
            valuation.marketCapProjetado,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Erro ao salvar"
      );
    }

    const result =
      await response.json();

    {/* 
        console.log(
        "Valuation salvo:",
        result
      );
    */}

    alert(
      "Valuation salvo com sucesso!"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Erro ao salvar valuation."
    );

  }
}


//console.log("valuation", valuation);
//console.log("valuation completo", valuation);
//console.log("rows",dcfRows);
//console.log(Object.keys(valuation));  

  return (
    <div className="bg-slate-50 min-h-screen">

      <div
        className="
          mx-auto
          max-w-[1400px]
          p-8
          space-y-6
        "
      >

        <SearchBar
          ticker={ticker}
          setTicker={setTicker}
        />

        <MetricCards
          precoAtual={precoAtual}
          setPrecoAtual={setPrecoAtual}
          totalAcoes={totalAcoes}
          setTotalAcoes={setTotalAcoes}
          marketCap={marketCap}
          payout={payout}
          roe={roe}
        />
        

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-4 space-y-6">

            <PremissasCard
              payout={payout}
              setPayout={setPayout}
              roe={roe}
              setRoe={setRoe}
              taxaCrescimento={taxaCrescimento}
              taxaDesconto={taxaDesconto}
              setTaxaDesconto={setTaxaDesconto}
              crescimentoPerpetuo={crescimentoPerpetuo}
              setCrescimentoPerpetuo={setCrescimentoPerpetuo}
            />

            <RealidadeProjetadaCard
              marketCap={valuation.marketCapProjetado}
              totalAcoes={totalAcoes}
              precoPorAcao={valuation.precoJusto}
              upsideDownside={valuation.upsideDownside}
              onReset={handleReset}
              onSave={handleSave}
            />

          </div>

          <div className="col-span-8">

            <DcfTable
                rows={dcfRows}
                setRows={setDcfRows}
                calculatedRows={valuation.rows}
                valorTerminal={valuation.valorTerminal}
                vplPerpetuo={valuation.vplPerpetuo}
                taxaCrescimento={taxaCrescimento}
                crescimentoPerpetuo={crescimentoPerpetuo}
                setCrescimentoPerpetuo={setCrescimentoPerpetuo}
            />
          </div>
        </div>
        <AnnotationsCard />
      </div>
    </div>
);
}

