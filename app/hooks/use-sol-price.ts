import { useEffect, useState } from "react";

export default function useSolPrice(refresher?: number) {
  const [solPrice, setSolPrice] = useState("0");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data?.solana?.usd) {
          throw new Error('Invalid price data received');
        }
        setSolPrice(data.solana.usd.toString());
      })
      .catch(error => {
        console.error(`Error fetching SOL price: ${error}`);
        setError(error.message);
        setSolPrice("0");
      });
  }, [refresher]);

  return {
    solPrice,
    error,
  };
}
