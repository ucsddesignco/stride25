import { useEffect, useRef, useState, startTransition } from 'react';
import type { BubbleClusterProps, Circle } from './types';
import { CompanyData, type BubbleCategory } from './CompanyData';

export function useBubbleCluster(category: BubbleCategory = 'Recruiting', _props?: BubbleClusterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isFadingIn, setIsFadingIn] = useState(false);
  const previousCategoryRef = useRef<BubbleCategory | null>(null);
  const regenerationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Helper to generate circles using the current container size and selected category
  const generateCircles = () => {
    const margin = 20;

    const companies = CompanyData[category];
    const mainBubbles: Circle[] = companies.map((company) => ({
      id: company.id,
      x: Math.random() * (containerSize.width - 150 - margin * 2) + 75 + margin,
      y: Math.random() * (containerSize.height - 150 - margin * 2) + 75 + margin,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 100,
      targetSize: 100,
      isExpanded: false,
      isInteractable: true,
      bubbleType: 'main',
      isHovered: false,
      isPressed: false,
      description: company.description,
      logo: company.logo,
      name: company.name,
      category: company.category,
      link: company.link,
    }));

    const accentSizes = [30, 35, 50, 40, 25, 45, 28, 42, 32, 38, 27, 48];
    const accentColors = ['#A8EAFC', '#DCF7FF'];

    const accentBubbles: Circle[] = Array.from({ length: 12 }, (_, i) => {
      const size = accentSizes[i] / 2;
      return {
        id: i + 100,
        x: Math.random() * (containerSize.width - size - margin * 2) + size / 2 + margin,
        y: Math.random() * (containerSize.height - size - margin * 2) + size / 2 + margin,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size,
        targetSize: size,
        isExpanded: false,
        isInteractable: false,
        bubbleType: 'accent',
        accentColor: accentColors[i % accentColors.length],
        isHovered: false,
        isPressed: false,
      } as Circle;
    });

    setCircles([...mainBubbles, ...accentBubbles]);
  };

  // Initialize once when size is known; do not regenerate on viewport resize
  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (containerSize.width === 0 || containerSize.height === 0) return;

    setIsFadingIn(true);
    generateCircles();
    setTimeout(() => {
      setIsFadingIn(false);
    }, 400);
    hasInitializedRef.current = true;
    previousCategoryRef.current = category;
  }, [containerSize]);

  // Regenerate only on category change (not on viewport resize)
  useEffect(() => {
    if (!hasInitializedRef.current) return;
    const isCategoryChange = previousCategoryRef.current !== null && previousCategoryRef.current !== category;
    if (!isCategoryChange) return;
    previousCategoryRef.current = category;

    if (regenerationTimeoutRef.current) {
      clearTimeout(regenerationTimeoutRef.current);
    }

    startTransition(() => {
      regenerationTimeoutRef.current = setTimeout(() => {
        startTransition(() => {
          setCircles([]);
          requestAnimationFrame(() => {
            setIsFadingIn(true);
            generateCircles();
            setTimeout(() => {
              setIsFadingIn(false);
            }, 400);
          });
        });
      }, 200);
    });

    return () => {
      if (regenerationTimeoutRef.current) {
        clearTimeout(regenerationTimeoutRef.current);
        regenerationTimeoutRef.current = null;
      }
    };
  }, [category]);

  useEffect(() => {
    if (circles.length === 0) return;

    const animate = () => {
      setCircles((prevCircles) => {
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        // Define a centered target rectangle with 2h:1w aspect ratio
        const targetAspectHtoW = 2; // height:width
        const padding = 40;
        const maxWidth = Math.max(0, containerSize.width - padding * 2);
        const maxHeight = Math.max(0, containerSize.height - padding * 2);
        const rectWidth = Math.min(maxWidth, maxHeight / targetAspectHtoW);
        const rectHeight = rectWidth * targetAspectHtoW;
        const rectLeft = centerX - rectWidth / 2;
        const rectRight = centerX + rectWidth / 2;
        const rectTop = centerY - rectHeight / 2;
        const rectBottom = centerY + rectHeight / 2;

        return prevCircles.map((circle) => {
          let newVx = circle.vx;
          let newVy = circle.vy;

          if (circle.isExpanded) {
            const targetX = circle.targetX ?? centerX;
            const targetY = circle.targetY ?? centerY;
            const distToTargetX = targetX - circle.x;
            const distToTargetY = targetY - circle.y;
            const distToTarget = Math.sqrt(distToTargetX * distToTargetX + distToTargetY * distToTargetY);
            if (distToTarget > 5) {
              const centeringStrength = 0.002;
              newVx += distToTargetX * centeringStrength;
              newVy += distToTargetY * centeringStrength;
            } else {
              newVx *= 0.8;
              newVy *= 0.8;
            }
          } else {
            // Anisotropic gravity favoring vertical spread to encourage 2h:1w occupancy
            const distToCenterX = centerX - circle.x;
            const distToCenterY = centerY - circle.y;
            const gravityStrengthX = 0.00035;
            const gravityStrengthY = 0.0007;
            newVx += distToCenterX * gravityStrengthX;
            newVy += distToCenterY * gravityStrengthY;

            // Rectangular shaping force: gently pull bubbles back inside the target rectangle
            const clampedX = Math.max(rectLeft, Math.min(circle.x, rectRight));
            const clampedY = Math.max(rectTop, Math.min(circle.y, rectBottom));
            const dxToRect = clampedX - circle.x;
            const dyToRect = clampedY - circle.y;
            const shapeStrength = 0.002;
            newVx += dxToRect * shapeStrength;
            newVy += dyToRect * shapeStrength;
          }

          if (!circle.isExpanded) {
            const separationBuffer = 12; // extra gap to ensure borders never touch
            prevCircles.forEach((other) => {
              if (other.id === circle.id) return;
              const dx = circle.x - other.x;
              const dy = circle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = (circle.size + other.size) / 2 + separationBuffer;
              if (distance < minDistance && distance > 0) {
                const repulsionStrength = 0.1;
                const force = (minDistance - distance) * repulsionStrength;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            });
          }

          newVx *= 0.95;
          newVy *= 0.95;

          let newX = circle.x + newVx;
          let newY = circle.y + newVy;

          // Remove container-edge collision: allow bubbles to move beyond the container

          // Positional correction to resolve any remaining overlaps after movement
          if (!circle.isExpanded) {
            const separationBuffer = 12;
            prevCircles.forEach((other) => {
              if (other.id === circle.id) return;
              const dx = newX - other.x;
              const dy = newY - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = (circle.size + other.size) / 2 + separationBuffer;
              if (distance > 0 && distance < minDistance) {
                const overlap = (minDistance - distance) * 0.5;
                const nx = dx / distance;
                const ny = dy / distance;
                newX += nx * overlap;
                newY += ny * overlap;
              }
            });
          }

          let newSize = circle.size;
          const sizeDiff = circle.targetSize - circle.size;
          newSize += sizeDiff * 0.12;

          return { ...circle, x: newX, y: newY, vx: newVx, vy: newVy, size: newSize };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [circles.length, containerSize]);

  const handleCircleClick = (clickedId: number, event: React.MouseEvent) => {
    event.preventDefault();
    setCircles((prevCircles) => {
      const clickedCircle = prevCircles.find((c) => c.id === clickedId);
      if (!clickedCircle || !clickedCircle.isInteractable) return prevCircles;

      const willExpand = !clickedCircle.isExpanded;
      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;
      const expandedSize = 440;

      return prevCircles.map((circle) => {
        if (circle.id === clickedId) {
          const newIsExpanded = !circle.isExpanded;
          return {
            ...circle,
            targetSize: newIsExpanded ? expandedSize : 100,
            isExpanded: newIsExpanded,
            targetX: newIsExpanded ? centerX : undefined,
            targetY: newIsExpanded ? centerY : undefined,
          };
        } else if (circle.isInteractable) {
          const clicked = prevCircles.find((c) => c.id === clickedId);
          if (clicked) {
            const dx = circle.x - clicked.x;
            const dy = circle.y - clicked.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const updated = { ...circle } as Circle;
            if (willExpand) {
              updated.targetSize = 100;
              updated.isExpanded = false;
              updated.targetX = undefined;
              updated.targetY = undefined;
            }
            if (distance > 0 && distance < 200) {
              const pushStrength = 2;
              const pushX = (dx / distance) * pushStrength;
              const pushY = (dy / distance) * pushStrength;
              updated.vx = circle.vx + pushX;
              updated.vy = circle.vy + pushY;
            }
            return updated;
          }
        } else {
          const clicked = prevCircles.find((c) => c.id === clickedId);
          if (clicked) {
            const dx = circle.x - clicked.x;
            const dy = circle.y - clicked.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < 150) {
              const pushStrength = 1.5;
              const pushX = (dx / distance) * pushStrength;
              const pushY = (dy / distance) * pushStrength;
              return { ...circle, vx: circle.vx + pushX, vy: circle.vy + pushY };
            }
          }
        }
        return circle;
      });
    });
  };

  const handleMouseEnter = (id: number) => {
    setCircles((prev) => prev.map((c) => (c.id === id && c.isInteractable ? { ...c, isHovered: true } : c)));
  };
  const handleMouseLeave = (id: number) => {
    setCircles((prev) => prev.map((c) => (c.id === id ? { ...c, isHovered: false, isPressed: false } : c)));
  };
  const handleMouseDown = (id: number) => {
    setCircles((prev) => prev.map((c) => (c.id === id && c.isInteractable ? { ...c, isPressed: true } : c)));
  };
  const handleMouseUp = (id: number) => {
    setCircles((prev) => prev.map((c) => (c.id === id ? { ...c, isPressed: false } : c)));
  };

  const resetSizes = () => {
    setCircles((prev) =>
      prev.map((c) => ({
        ...c,
        targetSize: c.isInteractable ? 100 : c.size,
        isExpanded: false,
        targetX: undefined,
        targetY: undefined,
      }))
    );
  };

  return {
    containerRef,
    circles,
    handleCircleClick,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    resetSizes,
    isFadingIn,
  } as const;
}


