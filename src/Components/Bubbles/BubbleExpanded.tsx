import styles from './BubbleCluster.module.css';
import { AoPSLogoPaths } from './AoPSLogoPaths';

export function BubbleExpanded() {
  return (
    <div className={styles.expandedBubble}>
      <div className={styles.logoContainer}>
        <svg className={styles.logoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <g>
            <rect fill="None" height="100" rx="50" width="100" />
            <g>
              <AoPSLogoPaths />
            </g>
          </g>
        </svg>
      </div>
      <div className={styles.textContent}>
        The Art of Problem Solving is a company dedicated to enhancing the
        mathematical skills of students through innovative resources and
        engaging courses.
      </div>
    </div>
  );
}


