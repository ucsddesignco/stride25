import { useEffect, useRef, useState } from 'react';
import type { BubbleClusterProps, Circle } from './types';
import { CompanyData } from './CompanyData';

export function useBubbleCluster(_props?: BubbleClusterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
    const margin = 20;

    const mainBubbles: Circle[] = CompanyData.map((company) => ({
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
    }));

    const accentSizes = [30, 35, 50, 40, 25, 45, 28, 42, 32, 38, 27, 48];
    const accentColors = ['#A8EAFC', '#DCF7FF'];

    const accentBubbles: Circle[] = Array.from({ length: 12 }, (_, i) => {
      const size = accentSizes[i];
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
  }, [containerSize]);

  useEffect(() => {
    if (circles.length === 0) return;

    const animate = () => {
      setCircles((prevCircles) => {
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

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
            const distToCenterX = centerX - circle.x;
            const distToCenterY = centerY - circle.y;
            const distToCenter = Math.sqrt(distToCenterX * distToCenterX + distToCenterY * distToCenterY);
            if (distToCenter > 0) {
              const gravityStrength = 0.0005;
              newVx += (distToCenterX / distToCenter) * gravityStrength * distToCenter;
              newVy += (distToCenterY / distToCenter) * gravityStrength * distToCenter;
            }
          }

          if (!circle.isExpanded) {
            prevCircles.forEach((other) => {
              if (other.id === circle.id) return;
              const dx = circle.x - other.x;
              const dy = circle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = (circle.size + other.size) / 2 + 20;
              if (distance < minDistance && distance > 0) {
                const repulsionStrength = 0.06;
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

          const radius = circle.size / 2;
          const margin = 20;
          if (newX - radius < margin) {
            newX = radius + margin;
            newVx = Math.abs(newVx) * 0.4;
          } else if (newX + radius > containerSize.width - margin) {
            newX = containerSize.width - radius - margin;
            newVx = -Math.abs(newVx) * 0.4;
          }

          if (newY - radius < margin) {
            newY = radius + margin;
            newVy = Math.abs(newVy) * 0.4;
          } else if (newY + radius > containerSize.height - margin) {
            newY = containerSize.height - radius - margin;
            newVy = -Math.abs(newVy) * 0.4;
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
      const isMobile = window.innerWidth < 768;
      const expandedSize = isMobile ? 270 : 360;

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
  } as const;
}


