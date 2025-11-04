import styles from './BubbleCluster.module.css';

export function AccentBubble({ color, size }: { color: string; size: number }) {
  return (
    <svg
      className={styles.svgContainer}
      fill="none"
      preserveAspectRatio="none"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} opacity={0.8} />
    </svg>
  );
}


