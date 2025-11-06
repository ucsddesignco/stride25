import { useState, useMemo } from 'react';
import styles from './BubbleCluster.module.css';
import { AccentBubble } from './AccentBubble';
import { BubbleCollapsed } from './BubbleCollapsed';
import { BubbleExpanded } from './BubbleExpanded';
import { useBubbleCluster } from './useBubbleCluster';
import type { BubbleClusterProps } from './types';
import type { BubbleCategory } from './CompanyData';
import Filter from '../Filter/Filter';

export function BubbleCluster({
  showInstructions = false,
}: BubbleClusterProps) {
  const [selectedCategory, setSelectedCategory] = useState<BubbleCategory>('Recruiting');
  const categories: BubbleCategory[] = useMemo(() => ['Recruiting', 'Networking', 'Student Ambassadors'], []);
  
  const {
    containerRef,
    circles,
    handleCircleClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    isFadingIn,
  } = useBubbleCluster(selectedCategory);

  return (
    <div className={styles.bubbleClusterContainer}>
      {/* Background pattern for depth */}
      <div className={styles.backgroundPattern} />

      {/* Filter component for category selection */}
      <div className={styles.filterContainer}>
        <Filter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => setSelectedCategory(category as BubbleCategory)}
        />
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className={styles.instructions}>
          <p>
            Click any bubble to expand it! Only one bubble can be expanded
            at a time, and it will push others away while maintaining the
            cluster's gravitational attraction.
          </p>
        </div>
      )}

      {/* Container for circles */}
      <div ref={containerRef} className={styles.circlesContainer}>
        {circles.map((circle) => {
          const description = circle.bubbleType === 'main' ? circle.description ?? '' : '';
          const scale = circle.isInteractable
            ? circle.isPressed
              ? 0.95
              : circle.isHovered
                ? 1.05
                : 1
            : 1;

          return (
            <div
              key={circle.id}
              className={`${styles.bubble} ${
                circle.isInteractable
                  ? styles.interactable
                  : styles.nonInteractable
              } ${circle.bubbleType === 'main' && circle.isExpanded ? styles.expanded : ''} ${isFadingIn ? styles.fadeIn : ''}`}
              style={{
                left: circle.x - circle.size / 2,
                top: circle.y - circle.size / 2,
                width: circle.size,
                height: circle.size,
                transform: `scale(${scale})`,
              }}
              onClick={(event) => handleCircleClick(circle.id, event)}
              onMouseEnter={() => handleMouseEnter(circle.id)}
              onMouseLeave={() => handleMouseLeave(circle.id)}
              onMouseDown={() => handleMouseDown(circle.id)}
              onMouseUp={() => handleMouseUp(circle.id)}
            >
              {/* Subtle glow effect */}
              <div
                className={styles.glowEffect}
                style={{
                  backgroundColor:
                    circle.bubbleType === 'main'
                      ? circle.isExpanded
                        ? '#1C415A'
                        : '#1E7083'
                      : circle.accentColor,
                }}
              />

              {/* Main bubble with SVG content */}
              <div className={styles.bubbleContent}>
                {circle.bubbleType === 'main' ? (
                  circle.isExpanded ? (
                    <BubbleExpanded 
                      description={description} 
                      logo={circle.logo}
                      name={circle.name}
                      category={circle.category}
                      link={circle.link}
                    />
                  ) : (
                    <BubbleCollapsed 
                      logo={circle.logo}
                      name={circle.name}
                    />
                  )
                ) : (
                  <AccentBubble
                    color={circle.accentColor!}
                    size={circle.size}
                  />
                )}
              </div>
              
              {/* Close button for expanded bubbles - outside bubbleContent to avoid overflow clipping */}
              {circle.bubbleType === 'main' && circle.isExpanded && (
                <button 
                  className={styles.closeButton} 
                  onClick={(e) => {
                    e.stopPropagation();
                    const event = { preventDefault: () => {} } as React.MouseEvent;
                    handleCircleClick(circle.id, event);
                  }}
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#D3F4FA"/>
                    <path d="M8 8L16 16M16 8L8 16" stroke="#1C415A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
