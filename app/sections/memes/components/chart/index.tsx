import { Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import clsx from 'clsx';
import styles from './index.module.css';
import { numberFormatter } from '@/app/utils/common';

const PriceChart = (props: { className?: string; token?: { kLineData?: { time: number; price: number; }[]; } }) => {
  const { className, token } = props;
  const containerRef = useRef<any>();
  const [showCircles, setShowCircles] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.zIndex = '1000';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
    setPortalContainer(container);

    const handleClickOutside = (event: MouseEvent) => {
      const chartContainer = containerRef.current;
      if (chartContainer && !chartContainer.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Cleanup
    return () => {
      document.body.removeChild(container);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChartClick = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const data = token?.kLineData || [];
  const lastDataPoint = data[data.length - 1];
  const minClose = Math.min(...data.map((d: any) => d.price));
  const maxClose = Math.max(...data.map((d: any) => d.price));
  const chartHeight = 49;
  const padding = 6;

  const rawCy = (chartHeight - padding * 2) * (1 - (lastDataPoint.price - minClose) / (maxClose - minClose)) + padding;
  const cy = Math.max(padding, Math.min(chartHeight - padding, rawCy));

  // Custom tooltip with portal
  const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
    if (!active || !payload || !payload.length || !portalContainer || !showTooltip) return null;

    const timestamp = payload[0].payload.timestamp;
    const formattedTime = dayjs(timestamp).format('MM-DD HH:mm');

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 120;
    const tooltipHeight = 64;

    const chartElement = containerRef.current;
    const chartRect = chartElement?.getBoundingClientRect();

    if (!chartRect) return null;

    let left = coordinate.x + chartRect.left;
    let top = coordinate.y + chartRect.top;

    if (left + tooltipWidth > viewportWidth) {
      left = left - tooltipWidth - 10;
    }
    if (top + tooltipHeight > viewportHeight) {
      top = top - tooltipHeight - 10;
    }

    return createPortal(
      <div style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none',
        transform: 'translate(10px, -50%)',
        zIndex: 1000,
        whiteSpace: 'nowrap'
      }}>
        <p style={{ color: '#fff', margin: 0 }}>
          Time: {formattedTime}
        </p>
        <p style={{ color: '#C9FF5D', margin: 0 }}>
          Price: {numberFormatter(payload[0].value, 8, true)}
        </p>
      </div>,
      portalContainer
    );
  };

  return (
    <div
      ref={containerRef}
      className={clsx(styles.PriceChartContainer, className)}
    >
      <LineChart
        width={132}
        height={49}
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        onClick={handleChartClick}
      >
        <XAxis dataKey="timestamp" hide={true} />
        <YAxis hide={true} domain={['auto', 'auto']} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: showTooltip ? '#C9FF5D' : 'none', strokeWidth: 1, strokeDasharray: '3 3' }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#C9FF5D"
          strokeWidth={1}
          dot={false}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="linear"
          onAnimationEnd={() => setShowCircles(true)}
          activeDot={false}
        />
        {showCircles && (
          <>
            <circle
              cx={126}
              cy={cy}
              r={6}
              fill="#C9FF5D"
              fillOpacity={0.3}
              stroke="none"
            />
            <circle
              cx={126}
              cy={cy}
              r={3}
              fill="#C9FF5D"
              stroke="none"
            />
          </>
        )}
      </LineChart>
    </div>
  );
};

export default PriceChart;