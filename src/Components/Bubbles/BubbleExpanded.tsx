import styles from './BubbleCluster.module.css';
import { AoPSLogoPaths } from './AoPSLogoPaths';
import { useInlineSVG } from './useInlineSVG';

interface BubbleExpandedProps {
  description: string;
  logo?: string;
  name?: string;
  category?: string;
  link?: string;
}

export function BubbleExpanded({ description, logo, name, category, link }: BubbleExpandedProps) {
  // Load SVG content inline for crisp rendering
  const inlineSvgData = useInlineSVG(logo);
  
  return (
    <div className={styles.expandedBubble}>
      <div className={`${styles.logoContainer} ${styles.fadeInContent}`}>
        {logo ? (
          // If logo exists, render SVG image
          (() => {
            // Make Copilot and Claude logos larger
            const isCopilotOrClaude = logo.includes('CoPilot.svg') || logo.includes('Claude.svg');
            const imageSize = isCopilotOrClaude ? 95 : 80;
            const imageOffset = (100 - imageSize) / 2;
            const scale = imageSize / 100;
            
            // Use inline SVG for crisp rendering, fallback to image tag if not loaded yet
            if (inlineSvgData) {
              return (
                <svg className={styles.logoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <g>
                    <rect fill="None" height="100" rx="50" width="100" />
                    <g transform={`translate(${imageOffset}, ${imageOffset}) scale(${scale})`}>
                      <svg
                        width="100"
                        height="100"
                        viewBox={inlineSvgData.viewBox}
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                        dangerouslySetInnerHTML={{ __html: inlineSvgData.content }}
                      />
                    </g>
                  </g>
                </svg>
              );
            }
            
            // Fallback to image tag while loading
            return (
              <svg className={styles.logoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <g>
                  <rect fill="None" height="100" rx="50" width="100" />
                  <image
                    href={logo}
                    x={imageOffset}
                    y={imageOffset}
                    width={imageSize}
                    height={imageSize}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      imageRendering: 'auto',
                      shapeRendering: 'geometricPrecision',
                    }}
                  />
                </g>
              </svg>
            );
          })()
        ) : name ? (
          // If no logo but name exists, render text with updated styling
          // Check if name contains parentheses for subtitle formatting
          (() => {
            const parenMatch = name.match(/^(.+?)\s*\((.+?)\)$/);
            const mainText = parenMatch ? parenMatch[1].trim() : name;
            const subtitleText = parenMatch ? parenMatch[2].trim() : null;
            const mainWords = mainText.split(' ');
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
            const mainFontSize = isMobile ? 18 : isDesktop ? 18 : 20;
            const subtitleFontSize = isMobile ? 12 : 14;
            const lineSpacing = isMobile ? 14 : 16;
            
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
                    fontSize={mainFontSize}
                    fontWeight="700"
                    fontFamily="Bricolage Grotesque, sans-serif"
                    className={styles.expandedHeading}
                  >
                    {mainWords.map((word, i) => (
                      <tspan key={i} x="50" dy={i === 0 ? 0 : lineSpacing}>
                        {word}
                      </tspan>
                    ))}
                    {subtitleText && (
                      <>
                        <tspan x="50" dy={mainWords.length > 1 ? (isMobile ? 4 : 6) : (isMobile ? 8 : 10)} fontSize={subtitleFontSize} fontWeight="400">
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
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${styles.learnMoreButton} ${styles.fadeInContent}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Learn More
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4H12V12" stroke="#09456F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )}
    </div>
  );
}


