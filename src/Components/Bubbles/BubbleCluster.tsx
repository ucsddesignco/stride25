import { useState, useEffect, useRef } from "react";
import svgPaths from "./imports/svg-fb8zz5j5no";
import styles from "./BubbleCluster.module.css";

interface Circle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  targetSize: number;
  isExpanded: boolean;
  targetX?: number;
  targetY?: number;
  isInteractable: boolean;
  bubbleType: "main" | "accent";
  accentColor?: string;
  isHovered: boolean;
  isPressed: boolean;
  description: string;
}

// Collapsed bubble component (100px)
function BubbleCollapsed() {
  return (
    <svg
      className={styles.svgContainer}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <g>
        <rect fill="#A8EAFC" height="100" rx="50" width="100" />
        <g>
          <path d={svgPaths.p31fe2f00} fill="#1C415A" />
          <path d={svgPaths.p7114d00} fill="#1C415A" />
          <path d={svgPaths.p3c60c080} fill="#1C415A" />
          <path d={svgPaths.p1207cc80} fill="#1C415A" />
          <path d={svgPaths.p3c4b9bc0} fill="#1C415A" />
          <path d={svgPaths.pf5c5e00} fill="#1C415A" />
          <path d={svgPaths.pdb40470} fill="#1C415A" />
          <path d={svgPaths.p2c1bba00} fill="#1C415A" />
          <path
            clipRule="evenodd"
            d={svgPaths.p11c01680}
            fill="#1C415A"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d={svgPaths.p35f60b00}
            fill="#1C415A"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d={svgPaths.pecfdc00}
            fill="#1C415A"
            fillRule="evenodd"
          />
          <path d={svgPaths.p3be420c0} fill="#1C415A" />
          <path d={svgPaths.p1522d200} fill="#1C415A" />
          <path d={svgPaths.p16fe0780} fill="#1C415A" />
          <path d={svgPaths.p35e80d00} fill="#1C415A" />
          <path d={svgPaths.p1469e900} fill="#1C415A" />
          <path d={svgPaths.p19f62700} fill="#1C415A" />
          <path d={svgPaths.p11858b00} fill="#1C415A" />
          <path d={svgPaths.p1cf8b580} fill="#1C415A" />
          <path d={svgPaths.p2ebdc380} fill="#1C415A" />
          <path d={svgPaths.p10ccc800} fill="#1C415A" />
          <path d={svgPaths.p31235c00} fill="#1C415A" />
          <path d={svgPaths.p121d2980} fill="#1C415A" />
          <path d={svgPaths.p24283880} fill="#1C415A" />
          <path d={svgPaths.p7477500} fill="#1C415A" />
          <path d={svgPaths.p3c08400} fill="#1C415A" />
          <path d={svgPaths.pa8319c0} fill="#1C415A" />
          <path d={svgPaths.p13670500} fill="#1C415A" />
          <path d={svgPaths.p2b34f100} fill="#1C415A" />
          <path d={svgPaths.p1dd0b100} fill="#1C415A" />
          <path d={svgPaths.p3da4fc00} fill="#1C415A" />
        </g>
      </g>
    </svg>
  );
}

// Simple accent bubble component for non-interactive bubbles
function AccentBubble({
  color,
  size,
}: {
  color: string;
  size: number;
}) {
  return (
    <svg
      className={styles.svgContainer}
      fill="none"
      preserveAspectRatio="none"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill={color}
        opacity={0.8}
      />
    </svg>
  );
}

// Expanded bubble component with logo and text content
function BubbleExpanded({desc}: {desc: string}) {
  return (
    <div className={styles.expandedBubble}>
      {/* Scaled down logo */}
      <div className={styles.logoContainer}>
        <svg
          className={styles.logoSvg}
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <g>
            <rect fill="None" height="100" rx="50" width="100" />
            <g>
              <path d={svgPaths.p31fe2f00} fill="#1C415A" />
              <path d={svgPaths.p7114d00} fill="#1C415A" />
              <path d={svgPaths.p3c60c080} fill="#1C415A" />
              <path d={svgPaths.p1207cc80} fill="#1C415A" />
              <path d={svgPaths.p3c4b9bc0} fill="#1C415A" />
              <path d={svgPaths.pf5c5e00} fill="#1C415A" />
              <path d={svgPaths.pdb40470} fill="#1C415A" />
              <path d={svgPaths.p2c1bba00} fill="#1C415A" />
              <path
                clipRule="evenodd"
                d={svgPaths.p11c01680}
                fill="#1C415A"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d={svgPaths.p35f60b00}
                fill="#1C415A"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d={svgPaths.pecfdc00}
                fill="#1C415A"
                fillRule="evenodd"
              />
              <path d={svgPaths.p3be420c0} fill="#1C415A" />
              <path d={svgPaths.p1522d200} fill="#1C415A" />
              <path d={svgPaths.p16fe0780} fill="#1C415A" />
              <path d={svgPaths.p35e80d00} fill="#1C415A" />
              <path d={svgPaths.p1469e900} fill="#1C415A" />
              <path d={svgPaths.p19f62700} fill="#1C415A" />
              <path d={svgPaths.p11858b00} fill="#1C415A" />
              <path d={svgPaths.p1cf8b580} fill="#1C415A" />
              <path d={svgPaths.p2ebdc380} fill="#1C415A" />
              <path d={svgPaths.p10ccc800} fill="#1C415A" />
              <path d={svgPaths.p31235c00} fill="#1C415A" />
              <path d={svgPaths.p121d2980} fill="#1C415A" />
              <path d={svgPaths.p24283880} fill="#1C415A" />
              <path d={svgPaths.p7477500} fill="#1C415A" />
              <path d={svgPaths.p3c08400} fill="#1C415A" />
              <path d={svgPaths.pa8319c0} fill="#1C415A" />
              <path d={svgPaths.p13670500} fill="#1C415A" />
              <path d={svgPaths.p2b34f100} fill="#1C415A" />
              <path d={svgPaths.p1dd0b100} fill="#1C415A" />
              <path d={svgPaths.p3da4fc00} fill="#1C415A" />
            </g>
          </g>
        </svg>
      </div>
      
      {/* Text content */}
      <div className={styles.textContent}>
        {desc}

      </div>
    </div>
  );
}

interface BubbleClusterProps {
  showInstructions?: boolean;
  showResetButton?: boolean;
}

export function BubbleCluster({ 
  showInstructions = false, 
  showResetButton = true 
}: BubbleClusterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  // Initialize circles
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect =
          containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () =>
      window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0)
      return;

    const margin = 20;

    // Main interactive bubbles
    const mainBubbles: Circle[] = Array.from(
      { length: 8 },
      (_, i) => ({
        id: i,
        x:
          Math.random() *
            (containerSize.width - 150 - margin * 2) +
          75 +
          margin,
        y:
          Math.random() *
            (containerSize.height - 150 - margin * 2) +
          75 +
          margin,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 100, // All start at collapsed size
        targetSize: 100,
        isExpanded: false,
        isInteractable: true,
        bubbleType: "main",
        isHovered: false,
        isPressed: false,
        description: 'test2'
      }),
    );

    // Accent bubbles in various sizes (smaller range: 25-50px)
    const accentSizes = [
      30, 35, 50, 40, 25, 45, 28, 42, 32, 38, 27, 48,
    ];
    const accentColors = [
      "#A8EAFC",
      "#DCF7FF"
    ];

    const accentBubbles: Circle[] = Array.from(
      { length: 12 },
      (_, i) => {
        const size = accentSizes[i];
        return {
          id: i + 100, // Offset to avoid ID conflicts
          x:
            Math.random() *
              (containerSize.width - size - margin * 2) +
            size / 2 +
            margin,
          y:
            Math.random() *
              (containerSize.height - size - margin * 2) +
            size / 2 +
            margin,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: size,
          targetSize: size,
          isExpanded: false,
          isInteractable: false,
          bubbleType: "accent",
          accentColor: accentColors[i % accentColors.length],
          isHovered: false,
          isPressed: false,
        };
      },
    );

    // Combine all bubbles
    const allCircles = [...mainBubbles, ...accentBubbles];
    setCircles(allCircles);
  }, [containerSize]);

  // Physics simulation
  useEffect(() => {
    if (circles.length === 0) return;

    const animate = () => {
      setCircles((prevCircles) => {
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        return prevCircles.map((circle) => {
          let newVx = circle.vx;
          let newVy = circle.vy;

          // If expanded, move toward center with stronger force
          if (circle.isExpanded) {
            const targetX = circle.targetX ?? centerX;
            const targetY = circle.targetY ?? centerY;
            const distToTargetX = targetX - circle.x;
            const distToTargetY = targetY - circle.y;
            const distToTarget = Math.sqrt(
              distToTargetX * distToTargetX +
                distToTargetY * distToTargetY,
            );

            if (distToTarget > 5) {
              // Only apply centering force if not close enough
              const centeringStrength = 0.002;
              newVx += distToTargetX * centeringStrength;
              newVy += distToTargetY * centeringStrength;
            } else {
              // Close enough to center, reduce velocity
              newVx *= 0.8;
              newVy *= 0.8;
            }
          } else {
            // Normal gravity toward center for non-expanded bubbles
            const distToCenterX = centerX - circle.x;
            const distToCenterY = centerY - circle.y;
            const distToCenter = Math.sqrt(
              distToCenterX * distToCenterX +
                distToCenterY * distToCenterY,
            );

            if (distToCenter > 0) {
              const gravityStrength = 0.0005;
              newVx +=
                (distToCenterX / distToCenter) *
                gravityStrength *
                distToCenter;
              newVy +=
                (distToCenterY / distToCenter) *
                gravityStrength *
                distToCenter;
            }
          }

          // Repulsion from other circles (reduced for expanded bubbles)
          if (!circle.isExpanded) {
            prevCircles.forEach((other) => {
              if (other.id === circle.id) return;

              const dx = circle.x - other.x;
              const dy = circle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance =
                (circle.size + other.size) / 2 + 20;

              if (distance < minDistance && distance > 0) {
                const repulsionStrength = 0.06;
                const force =
                  (minDistance - distance) * repulsionStrength;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            });
          }

          // Apply damping
          newVx *= 0.95;
          newVy *= 0.95;

          // Update position
          let newX = circle.x + newVx;
          let newY = circle.y + newVy;

          // Boundary constraints with bounce (20px margin)
          const radius = circle.size / 2;
          const margin = 20;
          if (newX - radius < margin) {
            newX = radius + margin;
            newVx = Math.abs(newVx) * 0.4;
          } else if (
            newX + radius >
            containerSize.width - margin
          ) {
            newX = containerSize.width - radius - margin;
            newVx = -Math.abs(newVx) * 0.4;
          }

          if (newY - radius < margin) {
            newY = radius + margin;
            newVy = Math.abs(newVy) * 0.4;
          } else if (
            newY + radius >
            containerSize.height - margin
          ) {
            newY = containerSize.height - radius - margin;
            newVy = -Math.abs(newVy) * 0.4;
          }

          // Animate size toward target
          let newSize = circle.size;
          const sizeDiff = circle.targetSize - circle.size;
          newSize += sizeDiff * 0.12;

          return {
            ...circle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            size: newSize,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [circles.length, containerSize]);

  const handleCircleClick = (
    clickedId: number,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();

    setCircles((prevCircles) => {
      const clickedCircle = prevCircles.find(
        (c) => c.id === clickedId,
      );

      // Only allow interaction with main bubbles
      if (!clickedCircle || !clickedCircle.isInteractable)
        return prevCircles;

      const willExpand = !clickedCircle.isExpanded;
      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;
      
      // Detect mobile and adjust expanded size accordingly
      const isMobile = window.innerWidth < 768;
      const expandedSize = isMobile ? 270 : 360; // 0.75x size on mobile

      return prevCircles.map((circle) => {
        if (circle.id === clickedId) {
          // Toggle expansion - either expand to full size or collapse to 100px
          const newIsExpanded = !circle.isExpanded;
          return {
            ...circle,
            targetSize: newIsExpanded ? expandedSize : 100,
            isExpanded: newIsExpanded,
            targetX: newIsExpanded ? centerX : undefined,
            targetY: newIsExpanded ? centerY : undefined,
          };
        } else if (circle.isInteractable) {
          // Only affect other main bubbles
          const clickedCircle = prevCircles.find(
            (c) => c.id === clickedId,
          );
          if (clickedCircle) {
            const dx = circle.x - clickedCircle.x;
            const dy = circle.y - clickedCircle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let updatedCircle = { ...circle };

            // Collapse other bubbles if we're expanding the clicked one
            if (willExpand) {
              updatedCircle.targetSize = 100;
              updatedCircle.isExpanded = false;
              updatedCircle.targetX = undefined;
              updatedCircle.targetY = undefined;
            }

            // Push away nearby circles
            if (distance > 0 && distance < 200) {
              const pushStrength = 2;
              const pushX = (dx / distance) * pushStrength;
              const pushY = (dy / distance) * pushStrength;

              updatedCircle.vx = circle.vx + pushX;
              updatedCircle.vy = circle.vy + pushY;
            }

            return updatedCircle;
          }
        } else {
          // For accent bubbles, just apply push force if nearby
          const clickedCircle = prevCircles.find(
            (c) => c.id === clickedId,
          );
          if (clickedCircle) {
            const dx = circle.x - clickedCircle.x;
            const dy = circle.y - clickedCircle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < 150) {
              const pushStrength = 1.5;
              const pushX = (dx / distance) * pushStrength;
              const pushY = (dy / distance) * pushStrength;

              return {
                ...circle,
                vx: circle.vx + pushX,
                vy: circle.vy + pushY,
              };
            }
          }
        }
        return circle;
      });
    });
  };

  const handleMouseEnter = (id: number) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id && circle.isInteractable
          ? { ...circle, isHovered: true }
          : circle
      )
    );
  };

  const handleMouseLeave = (id: number) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id ? { ...circle, isHovered: false, isPressed: false } : circle
      )
    );
  };

  const handleMouseDown = (id: number) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id && circle.isInteractable
          ? { ...circle, isPressed: true }
          : circle
      )
    );
  };

  const handleMouseUp = (id: number) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id ? { ...circle, isPressed: false } : circle
      )
    );
  };

  const resetSizes = () => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) => ({
        ...circle,
        targetSize: circle.isInteractable ? 100 : circle.size, // Keep accent bubbles at their original size
        isExpanded: false,
        targetX: undefined,
        targetY: undefined,
      })),
    );
  };

  return (
    <div className={styles.bubbleClusterContainer}>
      {/* Background pattern for depth */}
      <div className={styles.backgroundPattern} />

      {/* Reset button */}
      {showResetButton && (
        <button
          onClick={resetSizes}
          className={styles.resetButton}
        >
          Reset Sizes
        </button>
      )}

      {/* Instructions */}
      {showInstructions && (
        <div className={styles.instructions}>
          <p>
            Click any AoPS bubble to expand it! Only one bubble
            can be expanded at a time, and it will push others
            away while maintaining the cluster's gravitational
            attraction.
          </p>
        </div>
      )}

      {/* Container for circles */}
      <div ref={containerRef} className={styles.circlesContainer}>
        {circles.map((circle) => {
          // Calculate transform scale based on hover/press state
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
                circle.isInteractable ? styles.interactable : styles.nonInteractable
              }`}
              style={{
                left: circle.x - circle.size / 2,
                top: circle.y - circle.size / 2,
                width: circle.size,
                height: circle.size,
                transform: `scale(${scale})`,
              }}
              onClick={(event) =>
                handleCircleClick(circle.id, event)
              }
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
                    circle.bubbleType === "main"
                      ? circle.isExpanded
                        ? "#1C415A"
                        : "#1E7083"
                      : circle.accentColor,
                }}
              />

              {/* Main bubble with SVG content */}
              <div className={styles.bubbleContent}>
                {circle.bubbleType === "main" ? (
                  circle.isExpanded ? (
                    <BubbleExpanded desc={circle.description}/>
                  ) : (
                    <BubbleCollapsed />
                  )
                ) : (
                  <AccentBubble
                    color={circle.accentColor!}
                    size={circle.size}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
