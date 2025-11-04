import styles from './BubbleCluster.module.css';
import { AoPSLogoPaths } from './AoPSLogoPaths';

interface BubbleExpandedProps {
  description: string;
  logo?: string;
  name?: string;
  category?: string;
}

export function BubbleExpanded({ description, logo, name, category }: BubbleExpandedProps) {
  return (
    <div className={styles.expandedBubble}>
      <div className={`${styles.logoContainer} ${styles.fadeInContent}`}>
        {logo ? (
          // If logo exists, render SVG image
          <svg className={styles.logoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <g>
              <rect fill="None" height="100" rx="50" width="100" />
              <image
                href={logo}
                x="10"
                y="10"
                width="80"
                height="80"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>
        ) : name ? (
          // If no logo but name exists, render text with updated styling
          // Check if name contains parentheses for subtitle formatting
          (() => {
            const parenMatch = name.match(/^(.+?)\s*\((.+?)\)$/);
            const mainText = parenMatch ? parenMatch[1].trim() : name;
            const subtitleText = parenMatch ? parenMatch[2].trim() : null;
            const mainWords = mainText.split(' ');
            const subtitleFontSize = 14;
            
            return (
              <svg className={styles.logoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <g>
                  <rect fill="None" height="100" rx="50" width="100" />
                  <text
                    x="50"
                    y="45"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#D3F4FA"
                    fontSize="20"
                    fontWeight="700"
                    fontFamily="Bricolage Grotesque, sans-serif"
                    className={styles.expandedHeading}
                  >
                    {mainWords.map((word, i) => (
                      <tspan key={i} x="50" dy={i === 0 ? 0 : 16}>
                        {word}
                      </tspan>
                    ))}
                    {subtitleText && (
                      <>
                        <tspan x="50" dy={mainWords.length > 1 ? 6 : 10} fontSize={subtitleFontSize} fontWeight="400">
                          ({subtitleText})
                        </tspan>
                      </>
                    )}
                  </text>
                </g>
              </svg>
            );
          })()
        ) : (
          // Fallback to AoPS logo
          <svg className={styles.logoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <g>
              <rect fill="None" height="100" rx="50" width="100" />
              <g>
                <AoPSLogoPaths />
              </g>
            </g>
          </svg>
        )}
      </div>
      {/* Show category label for Student Ambassadors */}
      {category === 'Student Ambassadors' && (
        <div className={`${styles.categoryLabel} ${styles.fadeInContent}`}>
          Student Ambassadors
        </div>
      )}
      <div className={`${styles.textContent} ${styles.fadeInContent}`}>
        {description}
      </div>
    </div>
  );
}


