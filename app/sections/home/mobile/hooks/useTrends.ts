import { useCallback, useEffect, useRef, useState } from 'react';

export function useTrends() {
  const timer = useRef<any>(0);
  const [visible, setVisible] = useState(true);

  const startInterval = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setVisible(true);
    }, 60000);
  }, [timer.current]);

  const handleClose = () => {
    setVisible(false);
    startInterval();
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return {
    visible,
    handleClose,
  };
}
