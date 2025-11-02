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
}

export interface BubbleClusterProps {
  showInstructions?: boolean;
  showResetButton?: boolean;
}


