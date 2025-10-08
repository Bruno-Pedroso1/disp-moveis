
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const GRID_ROWS = 7;
const GRID_COLS = 5;
const NODE_RADIUS = 7;
const LINE_COLOR = '#00f0ff';
const NODE_COLOR = '#00f0ff';

// Generate grid nodes
const NODES = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, idx) => {
  const row = Math.floor(idx / GRID_COLS);
  const col = idx % GRID_COLS;
  const paddingX = width * 0.08;
  const paddingY = height * 0.12;
  const gridWidth = width - 2 * paddingX;
  const gridHeight = height - 2 * paddingY;
  return {
    x: paddingX + (col * gridWidth) / (GRID_COLS - 1),
    y: paddingY + (row * gridHeight) / (GRID_ROWS - 1),
    r: NODE_RADIUS,
  };
});

// Connections: horizontal and vertical lines
type Connection = { from: typeof NODES[0]; to: typeof NODES[0] };
const CONNECTIONS: Connection[] = [];
for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < GRID_COLS; col++) {
    const idx = row * GRID_COLS + col;
    // Horizontal
    if (col < GRID_COLS - 1) {
      CONNECTIONS.push({
        from: NODES[idx],
        to: NODES[idx + 1],
      });
    }
    // Vertical
    if (row < GRID_ROWS - 1) {
      CONNECTIONS.push({
        from: NODES[idx],
        to: NODES[idx + GRID_COLS],
      });
    }
  }
}

export default function ParticlesBackground() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Animate node glow
  const getNodeOpacity = (idx: number) => {
    // Stagger pulse for each node
    const stagger = (pulse + idx * 7) % 100;
    return 0.6 + 0.4 * Math.abs(Math.sin((Math.PI * stagger) / 50));
  };

  return (
    <Svg
      style={{ position: 'absolute', top: 0, left: 0, width, height, zIndex: -1 }}
      width={width}
      height={height}
    >
      {/* Draw lines */}
      {CONNECTIONS.map((conn, idx) => (
        <Line
          key={idx}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke={LINE_COLOR}
          strokeWidth={2}
          opacity={0.35}
        />
      ))}
      {/* Draw nodes with animated glow */}
      {NODES.map((node, idx) => (
        <Circle
          key={idx}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={NODE_COLOR}
          opacity={getNodeOpacity(idx)}
          stroke="#fff"
          strokeWidth={1.5}
        />
      ))}
      {/* SVG filter for glow (not all platforms support) */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </Svg>
  );
}
