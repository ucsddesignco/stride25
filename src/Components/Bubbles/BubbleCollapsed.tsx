import styles from './BubbleCluster.module.css';
import { AoPSLogoPaths } from './AoPSLogoPaths';

export function BubbleCollapsed() {
  return (
    <svg className={styles.svgContainer} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
      <g>
        <rect fill="#A8EAFC" height="100" rx="50" width="100" />
        <g>
          <AoPSLogoPaths />
        </g>
      </g>
    </svg>
  );
}


