import { useEffect, useState } from "react";

export default function useSolPrice(refresher?: number) {
  const [solPrice, setSolPrice] = useState("0");
  const [error, setError] = useState<string | null>(null);
  // const baseURL = process.env.NEXT_PUBLIC_API || 'https://api.dumpdump.fun/api/v1';
 
  useEffect(() => {
    setError(null);
    fetch('https://api.stg.dumpdump.fun/sol-price')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data?.solPrice) {
          throw new Error('Invalid price data received');
        }
        setSolPrice(data?.solPrice.toString());
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
