let priceMarkerId: any;

export default function updatePriceMarker({
  price,
  lastPrice,
  time,
  tvWidgetRef
}: {
  price: number;
  lastPrice: number;
  time: number;
  tvWidgetRef: any;
}) {
  const chart = tvWidgetRef.current?.activeChart();

  if (!chart) return;

  if (priceMarkerId) {
    chart.removeEntity(priceMarkerId);
    priceMarkerId = undefined;
  }

  const res = chart.createShape(
    { time, price },
    {
      shape: price >= lastPrice ? "arrow_up" : "arrow_down",
      lock: true,
      disableSelection: true,
      disableSave: true,
      disableUndo: true,
      text: "",
      overrides: {
        showLabel: true,
        textcolor: "#FFFFFF",
        color: "#2962FF",
        fontsize: 12,
        bold: true,
        size: 2
      },
      zOrder: "top"
    }
  );
  if (res) {
    priceMarkerId = res;
  }
}
