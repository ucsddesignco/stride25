import { useMemo, useId } from 'react';
import styles from './BubbleCluster.module.css';
import { AoPSLogoPaths } from './AoPSLogoPaths';
import { useInlineSVG } from './useInlineSVG';

interface BubbleCollapsedProps {
  logo?: string;
  name?: string;
}

export function BubbleCollapsed({ logo, name }: BubbleCollapsedProps) {
  // Create unique gradient ID for each bubble instance
  const instanceId = useId();
  const gradientId = useMemo(() => {
    // Sanitize the ID to ensure it's safe for SVG URL references
    // Remove or replace any special characters that might break URL references
    const baseId = (logo || name || 'default').replace(/[^a-zA-Z0-9]/g, '-');
    const safeInstanceId = instanceId.replace(/[^a-zA-Z0-9]/g, '-');
    return `bubble-gradient-${baseId}-${safeInstanceId}`;
  }, [logo, name, instanceId]);
  
  // Load SVG content inline for crisp rendering
  const inlineSvgContent = useInlineSVG(logo);
  
  // Gradient definition: 12% opacity at top, 100% opacity at bottom (matches expanded bubble)
  // Gradient goes from top (y1=0%) to bottom (y2=100%)
  const gradientDef = (
    <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stopColor="#67AFCB" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#67AFCB" stopOpacity="1" />
    </linearGradient>
  );
  
  // If logo exists, render SVG image
  if (logo) {
    // Make Figma logo smaller
    const isFigma = logo.includes('Figma.svg');
    const logoSize = isFigma ? 60 : 80;
    // Center the logo: (viewBox size - logo size) / 2
    const logoXOffset = (100 - logoSize) / 2;
    const logoYOffset = (100 - logoSize) / 2;
    
    // Use inline SVG for crisp rendering, fallback to image tag if not loaded yet
    if (inlineSvgContent) {
      const scale = logoSize / 100;
      return (
        <svg className={styles.svgContainer} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
          <defs>
            {gradientDef}
          </defs>
          <rect fill={`url(#${gradientId})`} height="100" rx="50" width="100" x="0" y="0" />
          <g transform={`translate(${logoXOffset}, ${logoYOffset}) scale(${scale})`} style={{ pointerEvents: 'none' }}>
            <svg
              width="100"
              height="100"
              viewBox={inlineSvgContent.viewBox}
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              style={{ pointerEvents: 'none' }}
              dangerouslySetInnerHTML={{ __html: inlineSvgContent.content }}
            />
          </g>
        </svg>
      );
    }
    
    // Fallback to image tag while loading
    return (
      <svg className={styles.svgContainer} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
        <defs>
          {gradientDef}
        </defs>
        <rect fill={`url(#${gradientId})`} height="100" rx="50" width="100" x="0" y="0" />
        <image
          href={logo}
          x={logoXOffset}
          y={logoYOffset}
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid meet"
          style={{
            imageRendering: 'auto',
            shapeRendering: 'geometricPrecision',
            pointerEvents: 'none',
          }}
        />
      </svg>
    );
  }

  // If no logo, render text
  if (name) {
    const fontSize = 16;
    const subtitleFontSize = 12;
    const lineHeight = 18;
    
    // Check if name contains parentheses for subtitle formatting
    const parenMatch = name.match(/^(.+?)\s*\((.+?)\)$/);
    
    if (parenMatch) {
      // Has subtitle in parentheses
      const mainText = parenMatch[1].trim();
      const subtitleText = parenMatch[2].trim();
      const mainWords = mainText.split(' ');
      
      // Calculate total height: main text + subtitle
      const mainTextHeight = mainWords.length * fontSize + (mainWords.length - 1) * (lineHeight - fontSize);
      const totalTextHeight = mainTextHeight + subtitleFontSize + 4; // 4px gap between main and subtitle
      const startY = 50 - (totalTextHeight / 2);
      
      return (
        <svg className={styles.svgContainer} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
          <defs>
            {gradientDef}
          </defs>
          <rect fill={`url(#${gradientId})`} height="100" rx="50" width="100" x="0" y="0" />
          <text
            x="50"
            y={startY}
            textAnchor="middle"
            dominantBaseline="hanging"
            fill="#D3F4FA"
            fontSize={fontSize}
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            className={styles.logoText}
            style={{ pointerEvents: 'none' }}
          >
            {mainWords.map((word, i) => (
              <tspan key={i} x="50" dy={i === 0 ? 0 : lineHeight} textAnchor="middle" style={{ pointerEvents: 'none' }}>
                {word}
              </tspan>
            ))}
            {/* Subtitle in parentheses - keep on one line, remove word-spacing */}
            <tspan 
              x="50" 
              dy={mainWords.length > 1 ? 4 : lineHeight + 4} 
              textAnchor="middle"
              fontSize={subtitleFontSize}
              fontWeight="400"
              style={{ wordSpacing: 'normal', pointerEvents: 'none' }}
            >
              ({subtitleText})
            </tspan>
          </text>
        </svg>
      );
    }
    
    // No subtitle, render normally
    const words = name.split(' ');
    const totalTextHeight = words.length === 1 
      ? fontSize 
      : (words.length - 1) * lineHeight + fontSize;
    const startY = 50 - (totalTextHeight / 2);
    
    return (
      <svg className={styles.svgContainer} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
        <defs>
          {gradientDef}
        </defs>
        <rect fill={`url(#${gradientId})`} height="100" rx="50" width="100" x="0" y="0" />
        <text
          x="50"
          y={startY}
          textAnchor="middle"
          dominantBaseline="hanging"
          fill="#D3F4FA"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          className={styles.logoText}
          style={{ pointerEvents: 'none' }}
        >
          {words.map((word, i) => (
            <tspan key={i} x="50" dy={i === 0 ? 0 : lineHeight} textAnchor="middle" style={{ pointerEvents: 'none' }}>
              {word}
            </tspan>
          ))}
        </text>
      </svg>
    );
  }

  // Fallback to AoPS logo if no logo or name
  return (
    <svg className={styles.svgContainer} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
      <defs>
        {gradientDef}
      </defs>
      <rect fill={`url(#${gradientId})`} height="100" rx="50" width="100" x="0" y="0" />
      <g style={{ pointerEvents: 'none' }}>
        <AoPSLogoPaths />
      </g>
    </svg>
  );
}


