import { useEffect } from "react";
import Hammer from "hammerjs";
import { useThrottleFn } from 'ahooks';

export default function useSwip(containerRef: any, onPre: any, onNext: any, onPreing: any, onNexting: any, reBind: boolean, isBloacked: boolean) {

    // const { run: runPreing } = useThrottleFn(onPreing, {
    //     wait: 200, 
    // });

    // const { run: runNexting } = useThrottleFn(onNexting, {
    //     wait: 200, 
    // });
    

    useEffect(() => {
        if (containerRef.current && typeof window !== "undefined" && reBind) {
            const manager = new Hammer.Manager(containerRef.current);
            // const Swipe = new Hammer.Swipe();
            // manager.add(Swipe);

            const Pan = new Hammer.Pan({
                direction: Hammer.DIRECTION_ALL,
                threshold: 5,
                velocity: 0,
                pointers: 1,
                interval: 50
            });
            manager.add(Pan);

            const winWidth = window.innerWidth
            let startDistance = 0
            let direction = 0 // 0 right 1 left
            let moveTime = 0
            let isStart = false;

            manager.on('panstart', (e) => {
                // console.log('starting:', e)
                if (isBloacked) {
                    isStart = false
                    return
                }

                if (Date.now() - moveTime < 800) {
                    isStart = false
                    return
                }
                direction = 0
                startDistance = 0
                moveTime = Date.now()
                isStart = true
            });

            manager.on('panmove', (e) => {
                // console.log('move', isStart)
                if (!isStart) {
                    return
                }

                if (e.deltaX < 0 && e.deltaY > 0) {
                    direction = 1
                } else if (e.deltaX > 0 && e.deltaY < 0)  {
                    direction = 0
                } else {
                    direction = -1
                }

                // if (e.distance > maxDistance) {
                //     maxDistance = e.distance
                // }

                
                if (e.deltaX < 0) {
                    onPreing(e.distance / winWidth)
                } else {
                    onNexting(e.distance / winWidth)
                }

                // setTimeout(() => {
                //     // console.log('move2--', isStart)
                // }, 100)
               
            });

            manager.on('panend', (e) => {
                if (!isStart) {
                    return
                }
                isStart = false

                if (direction === 0) {
                    if (e.distance > startDistance + 20) {
                        onNext && onNext()
                    } else {
                        onNexting(0)
                    }
                } else if (direction === 1) {
                    if (e.distance > startDistance + 20) {
                        onPre && onPre()
                    } else {
                        onPreing(0)
                    }
                } else {
                    onNexting(0)
                }
                
                
                // moveTime = Date.now()
            });
            

            return () => {
                manager.off("panstart");
                manager.off("panmove");
                manager.off("panend");
            };
        }
    }, [reBind])
}