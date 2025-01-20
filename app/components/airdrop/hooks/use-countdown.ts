import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useConfig } from '@/app/store/useConfig';

export function useCountdown() {
  const { config }: any = useConfig();
  const { AirdropEndTime, AirdropStartTime } = config || {};

  const timer = useRef<any>(0);
  const [result, setResult] = useState<{ end: number; start: number; endSplit: number[]; startSplit: number[]; }>();

  useEffect(() => {
    const calc = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(calc, 60000);
      const _result = {
        startSplit: [0, 0, 0],
        endSplit: [0, 0, 0],
        start: 0,
        end: 0,
      };

      const curr = dayjs();
      const end = dayjs(AirdropEndTime);
      if (curr.isBefore(end)) {
        const diff = end.diff(curr);
        const diffDuration = dayjs.duration(diff);
        const days = diffDuration.days();
        const hours = diffDuration.hours();
        const minutes = diffDuration.minutes();

        _result.end = diff;
        _result.endSplit = [days, hours, minutes];
      }

      const start = dayjs(AirdropStartTime);
      if (curr.isBefore(start)) {
        const diff = start.diff(curr);
        const diffDuration = dayjs.duration(diff);
        const days = diffDuration.days();
        const hours = diffDuration.hours();
        const minutes = diffDuration.minutes();

        _result.start = diff;
        _result.startSplit = [days, hours, minutes];
      }

      setResult(_result);

      return _result;
    };

    calc();
    return () => {
      clearTimeout(timer.current);
    };
  }, [AirdropEndTime]);

  return [result];
}
