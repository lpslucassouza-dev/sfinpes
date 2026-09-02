export async function buscarCotacao(
  ticker: string
) {

  const response = await fetch(
    `https://brapi.dev/api/quote/${ticker}?token=${process.env.BRAPI_TOKEN}`
  );

  const data = await response.json();

  if (!data.results?.length) {
    throw new Error(
      `Ticker ${ticker} não encontrado`
    );
  }

  return data.results[0];
}