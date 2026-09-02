"use client";

import SearchBar from "./SearchBar";
import MetricCards from "./MetricCards";
import PremissasCard from "./PremissasCard";
import RealidadeProjetadaCard from "./RealidadeProjetadaCard";
import DcfTable from "./DcfTable";
import AnnotationsCard from "./AnnotationsCard";
import { useState } from "react";
import { ValuationService } from "@/lib/valuation/services";
import EmpresaInfoCard from "./EmpresaInfoCard";
import Link from "next/link";

export default function FormValuation() {

const [precoAtual, setPrecoAtual]     = useState(0);
const [totalAcoes, setTotalAcoes]     = useState(0);
const [payout, setPayout]             = useState(0);
const [roe, setRoe]                   = useState(0);
const [taxaDesconto, setTaxaDesconto] = useState(15);
const [taxaDescontoPerpetua,setTaxaDescontoPerpetua,] = useState(10);
const [crescimentoPerpetuo,setCrescimentoPerpetuo,] = useState(3);
const currentYear = new Date().getFullYear();
const [nomeEmpresa, setNomeEmpresa] = useState("");
const [ticker, setTicker] = useState("");
const [marketCapApi, setMarketCapApi] = useState(0);
const [pl, setPl] = useState(0);
const [lpa, setLpa] = useState(0);
const [max52, setMax52] = useState(0);
const [min52, setMin52] = useState(0);

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

async function handleSearchTicker() {

  if (!ticker) {
    alert(
      "Informe um ticker."
    );

    return;
  }

  try {

    const response =
      await fetch(
        "/api/acoes/buscar",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ticker,
          }),
        }
      );

    const result =
      await response.json();

    const stock =
      result.results?.[0];

      //console.log("LONG NAME:",stock.longName);
      console.log(stock);


    if (!stock) {
      throw new Error(
        "Ativo não encontrado"
      );
    }

    setPrecoAtual(
      stock.regularMarketPrice
    );

    setNomeEmpresa(
      stock.longName
    );

    setMarketCapApi(
      stock.marketCap ?? 0
    );

    setPl(
      stock.priceEarnings ?? 0
    );

    setLpa(
      stock.earningsPerShare ?? 0
    );

    setMax52(
      stock.fiftyTwoWeekHigh ?? 0
    );

    setMin52(
      stock.fiftyTwoWeekLow ?? 0
    );

    //console.log("Nome empresa salvo:",stock.longName);

    const totalAcoesCalculado =
      Math.round(
        stock.marketCap /
        stock.regularMarketPrice
      );

    setTotalAcoes(
      totalAcoesCalculado
    );

    console.log(result);

  } catch (error) {

    console.error(error);

    alert(
      "Erro ao buscar ativo."
    );

  }
}


//console.log("valuation", valuation);
//console.log("valuation completo", valuation);
//console.log("rows",dcfRows);
//console.log(Object.keys(valuation));  
//console.log("nomeEmpresa:",nomeEmpresa);




  return (
    <div className="bg-slate-50">

      <div
        className="
          mx-auto
          max-w-[1400px]
          p-8
          space-y-6
        "
      >

      <div className="mb-4">
        <Link href="/acoes"
          className="
            rounded-md
            border
            px-4
            py-2
            text-sm
            hover:bg-slate-100
            "
          >
            ← Voltar
        </Link>
      </div>

        <SearchBar
          ticker={ticker}
          setTicker={setTicker}
          nomeEmpresa={nomeEmpresa}
          onSearch={handleSearchTicker}
        />

      {/*
        <EmpresaInfoCard
          nomeEmpresa={nomeEmpresa}
          marketCap={marketCapApi}
          pl={pl}
          lpa={lpa}
          max52={max52}
          min52={min52}
          precoAtual={precoAtual}
          precoJusto={valuation.precoJusto}
          upside={valuation.upsideDownside}
        />
      */}
      
        <MetricCards
          precoAtual={precoAtual}
          setPrecoAtual={setPrecoAtual}
          totalAcoes={totalAcoes}
          setTotalAcoes={setTotalAcoes}
          marketCap={marketCap}
          payout={payout}
          roe={roe}
          pl={pl}
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

