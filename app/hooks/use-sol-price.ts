import { useEffect, useState } from "react";

export default function useSolPrice(refresher?: number) {
  const [solPrice, setSolPrice] = useState("0");
  useEffect(() => {
    fetch('https://price.jup.ag/v4/price?ids=SOL')
      .then(response => response.json())
      .then(data => {
        setSolPrice(data.data.SOL.price.toString());
      })
      .catch(error => {
        console.error(`Error fetching SOL price: ${error}`);
      });
  }, [refresher]);
  return {
    solPrice,
  };
}
