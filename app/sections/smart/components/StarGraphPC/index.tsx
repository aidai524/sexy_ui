import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './index.module.css';

interface StarGraphProps {
  centerNode: {
    id: string;
    name: string;
    image: string;
  };
  satellites: Array<{
    id: string;
    name: string;
    image: string;
    pnl?: number;
  }>;
}

interface NodeType extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  image: string;
  size: number;
  fixed?: boolean;
  fx?: number;
  fy?: number;
  pnl?: number;
}

const StarGraph: React.FC<StarGraphProps> = ({ centerNode, satellites }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Prepare data
    const nodes: NodeType[] = [
      {
        id: centerNode.id,
        name: centerNode.name,
        image: centerNode.image,
        size: 124,
        fixed: true,
        fx: width / 2,
        fy: height / 2,
      },
      ...satellites.map(sat => ({
        id: sat?.id || '',
        name: sat?.name || '',
        image: sat?.image || '',
        size: 36,
        pnl: sat?.pnl || 0
      })),
    ];

    const links = satellites.map(sat => ({
      source: centerNode.id,
      target: sat?.id || '',
      distance: Math.random() * 200 + 250,
    }));

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Define forces
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance((d: any) => d.distance))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.size / 2 + 50))
      .force('x', d3.forceX(width / 2).strength(0.08))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('boundary', () => {
        for (let node of nodes) {
          if (!node.fixed) {
            const r = node.size / 2;
            node.x = Math.max(r, Math.min(width - r, node.x ?? 0));
            node.y = Math.max(r, Math.min(height - r, node.y ?? 0));
          }
        }
      });

    const g = svg.append('g');

    const starsGroup = g.append('g')
      .attr('class', 'stars');

    for (let i = 0; i < 16; i++) {
      const randomX = Math.random() * width;
      const randomY = Math.random() * height;
      const randomDelay = Math.random() * 2; // 
      
      starsGroup.append('path')
        .attr('transform', `translate(${randomX}, ${randomY})`)
        .attr('opacity', '0.2')
        .attr('fill', 'white')
        .attr('class', styles.star) // 
        .style('animation-delay', `${randomDelay}s`) // 
        .attr('d', 'M5.80688 0.717265C5.86001 0.519929 6.13999 0.519929 6.19312 0.717265L7.24286 4.61602C7.26139 4.68485 7.31515 4.73861 7.38398 4.75714L11.2827 5.80688C11.4801 5.86001 11.4801 6.13999 11.2827 6.19312L7.38398 7.24286C7.31515 7.26139 7.26139 7.31515 7.24286 7.38398L6.19312 11.2827C6.13999 11.4801 5.86001 11.4801 5.80688 11.2827L4.75714 7.38398C4.73861 7.31515 4.68485 7.26139 4.61602 7.24286L0.717265 6.19312C0.519929 6.13999 0.519929 5.86001 0.717265 5.80688L4.61602 4.75714C4.68485 4.73861 4.73861 4.68485 4.75714 4.61602L5.80688 0.717265Z');
    }

    // Remove or comment out the zoom-related code
    // const zoom = d3.zoom()
    //   .scaleExtent([0.5, 2])
    //   .on('zoom', (event) => {
    //     g.attr('transform', event.transform);
    //   });

    // svg.call(zoom as any);

    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', '#C9FF5D')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('opacity', (d: any) => {
        return d.target.id === satellites?.[0]?.id ? 1 : 0.5;
      });

    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('opacity', (d: any) => {
        return d.id === centerNode.id || d.id === satellites?.[0]?.id ? 1 : 0.5;
      })
      .on('click', function(event: any, d: any) {
        if (d.id === centerNode.id) return;

        node.style('opacity', 0.5)
          .selectAll('text')  // 
          .style('opacity', 0);
        
        link.style('opacity', 0.5);

        node.filter((n: any) => n.id === centerNode.id)
          .style('opacity', 1);

        d3.select(this)
          .style('opacity', 1)
          .selectAll('text')  // 
          .style('opacity', 1);

        link.filter((l: any) => l.target.id === d.id)
          .style('opacity', 1);
      });

    node.append('circle')
      .attr('r', (d: any) => d.size / 2)
      .attr('fill', 'white')
      .attr('stroke', (d: any) => d.id === centerNode.id ? '#000000' : 'none')  
      .attr('stroke-width', (d: any) => d.id === centerNode.id ? 1 : 0);  

    const defs = node.append('defs');
    
    defs.append('clipPath')
      .attr('id', (d: any) => `clip-${d.id}`)
      .append('circle')
      .attr('r', (d: any) => d.size / 2);

    node.append('image')
      .attr('xlink:href', (d: any) => d.image)
      .attr('x', (d: any) => -d.size / 2)
      .attr('y', (d: any) => -d.size / 2)
      .attr('width', (d: any) => d.size)
      .attr('height', (d: any) => d.size)
      .attr('clip-path', (d: any) => `url(#clip-${d.id})`);

    node.append('text')
      .text((d: any) => d.name)
      .attr('text-anchor', 'middle')
      .attr('y', (d: any) => d.size / 2 + 20)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .style('opacity', (d: any) => {
        return d.id === satellites?.[0]?.id ? 1 : 0;  
      });
      
      node.append('text')
      .text((d: any) => {
        if (d.id !== centerNode.id && d.pnl !== undefined) {
          return `+${d.pnl.toLocaleString()}%`;
        }
        return '';
      })
      .attr('text-anchor', 'middle')
      .attr('y', (d: any) => d.size / 2 + 32)
      .attr('fill', '#C9FF5D')
      .attr('font-size', '10px')
      .style('opacity', (d: any) => {
        return d.id === satellites?.[0]?.id ? 1 : 0;  
      });

    
    simulation.on('tick', () => {
      link.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 2.5;  
        
        const angle = Math.atan2(dy, dx);
        
        const sourceRadius = 36;
        const targetRadius = 18;

        const startX = d.source.x + sourceRadius * Math.cos(angle);
        const startY = d.source.y + sourceRadius * Math.sin(angle);

        const endX = d.target.x - targetRadius * Math.cos(angle);
        const endY = d.target.y - targetRadius * Math.sin(angle);

        return `M${startX},${startY}A${dr},${dr} 0 0,1 ${endX},${endY}`;
      });

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        svg.attr('width', newWidth)
           .attr('height', newHeight);
        
        // Update center node position
        nodes[0].fx = newWidth / 2;
        nodes[0].fy = newHeight / 2;
        
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
        simulation.alpha(0.3).restart();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      simulation.stop();
      resizeObserver.disconnect();
    };
  }, [centerNode, satellites]);

  return (
    <div 
      ref={containerRef} 
      className={styles.container} 
    >
      <svg ref={svgRef} />
    </div>
  );
};

export default StarGraph;
