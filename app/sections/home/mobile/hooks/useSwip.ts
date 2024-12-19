import { useEffect } from "react";
import Hammer from "hammerjs";
import { useThrottleFn } from 'ahooks';

export default function useSwip(containerRef: any, onPre: any, onNext: any, onPreing: any, onNexting: any, reBind: boolean) {

    const { run: runPreing } = useThrottleFn(onPreing, {
        wait: 200, 
    });

    const { run: runNexting } = useThrottleFn(onNexting, {
        wait: 200, 
    });
    

    useEffect(() => {
        if (containerRef.current && typeof window !== "undefined" && reBind) {
            const manager = new Hammer.Manager(containerRef.current);
            // const Swipe = new Hammer.Swipe();
            // manager.add(Swipe);

            const Pan = new Hammer.Pan({
                direction: Hammer.DIRECTION_ALL, 
                threshold: 10 
            });
            manager.add(Pan);

            // manager.on("swipe", function (e) {
            //     console.log(11)
            //     const direction = e.offsetDirection;
            //     if (direction === 2 || direction === 16) {
            //         onPre && onPre()
            //     } else if (direction === 4 || direction === 8) {
            //         onNext && onNext()
            //     }
            // });

            const winWidth = window.innerWidth
            let maxDistance = 0
            let direction = 0 // 0 right 1 left

            manager.on('panstart', (e) => {
                console.log('拖动开始', e);
                direction = 0
                maxDistance = 0
            });

            manager.on('panmove', (e) => {
                // console.log('拖动进行中', e)
                if (e.deltaX < 0 && e.deltaY > 0) {
                    direction = 1
                } else if (e.deltaX > 0 && e.deltaY < 0)  {
                    direction = 0
                } else {
                    direction = -1
                }

                if (e.distance > maxDistance) {
                    maxDistance = e.distance
                }
                
                
                if (e.deltaX < 0) {
                    runPreing(e.distance / winWidth)
                } else {
                    runNexting(e.distance / winWidth)
                }
               
            });

            manager.on('panend', (e) => {
                console.log('direction: ', direction, 'e.distance:', e.distance , 'maxDistance:', maxDistance)

                if (direction === 0) {
                    if (e.distance > maxDistance - 20) {
                        onNext && onNext()
                    } else {
                        runNexting(0)
                    }
                } else if (direction === 1) {
                    if (e.distance > maxDistance - 20) {
                        onPre && onPre()
                    } else {
                        runPreing(0)
                    }
                } else {
                    runNexting(0)
                }

        
                
                console.log('拖动结束', e);
            });
            

            return () => {
                manager.off("panstart");
                manager.off("panmove");
                manager.off("panend");
            };
        }
    }, [reBind])
}