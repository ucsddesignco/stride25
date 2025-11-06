export interface Circle {
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
  bubbleType: 'main' | 'accent';
  accentColor?: string;
  isHovered: boolean;
  isPressed: boolean;
  description?: string;
  logo?: string; // Path to SVG logo, or undefined if text-only
  name?: string; // Company name for text-only logos
  category?: string; // Category for display purposes
  link?: string; // URL for "Learn More" button
}

export interface BubbleClusterProps {
  showInstructions?: boolean;
}


