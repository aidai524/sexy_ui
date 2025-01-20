import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RingChartProps {
  data: {
    value: number;
    name: string;
    color?: string;
  }[];
  size?: number;
}

export const RingChart: React.FC<RingChartProps> = ({ data, size = 20 }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
     tooltip: {
            show: false,
          },
      animation: false,
      color: data.map(item => item.color), // 
      series: [
        {
          type: 'pie',
          radius: ["60%", "80%"], // 
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            emphasis: {
              scale: false,
              disabled: true
            }
          },
          label: {
            show: false,
            position: "center",
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    chart.setOption(option as any);

    // 
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: size, height: size }} />;
};
