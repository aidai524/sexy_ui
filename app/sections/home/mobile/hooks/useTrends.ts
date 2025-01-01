import { useTrendsBannerStore } from "@/app/store/useTrends";

export function useTrends() {
  // const timer = useRef<any>(0);

  const trendsBannerStore: any = useTrendsBannerStore();

  // const startInterval = useCallback(() => {
  //   clearTimeout(timer.current);
  //   timer.current = setTimeout(() => {
  //     setVisible(true);
  //   }, 60000);
  // }, [timer.current]);

  const handleClose = () => {
    // setVisible(false);
    // startInterval();
    trendsBannerStore.set({ visible: false });
  };

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(timer.current);
  //   };
  // }, []);

  return {
    visible: trendsBannerStore.visible,
    handleClose
  };
}
