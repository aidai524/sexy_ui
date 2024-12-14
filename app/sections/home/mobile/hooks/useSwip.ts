import { useEffect } from "react";
import Hammer from "hammerjs";

export default function useSwip(containerRef: any, onPre: any, onNext: any, reBind: boolean) {
    useEffect(() => {
        if (containerRef.current && typeof window !== "undefined") {
            const manager = new Hammer.Manager(containerRef.current);
            const Swipe = new Hammer.Swipe();
            manager.add(Swipe);

            manager.on("swipe", function (e) {
                const direction = e.offsetDirection;
                if (direction === 2 || direction === 16) {
                    onPre && onPre()
                } else if (direction === 4 || direction === 8) {
                    onNext && onNext()
                }
            });

            return () => {
                manager.off("swipe");
            };
        }
    }, [reBind])
}