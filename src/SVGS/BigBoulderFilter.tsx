export default function BigBoulderFilterDesktop() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="758" 
      height="396" 
      id="bigBoulderFilter" 
      viewBox="0 0 758 396" 
      fill="none"
      style={{ 
        shapeRendering: "geometricPrecision",
        imageRendering: "crisp-edges",
        WebkitImageRendering: "-webkit-optimize-contrast",
        willChange: "opacity",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      } as React.CSSProperties}
      preserveAspectRatio="xMidYMid meet"
    >
      <path 
        d="M0 0H758V396H0V0Z" 
        fill="url(#paint0_radial_5290_1374)" 
        style={{ 
          opacity: 1,
        } as React.CSSProperties} 
      />
      <path 
        d="M0 0H758V396H0V0Z" 
        fill="#417492" 
        fillOpacity={0.4}
        style={{ 
          opacity: 1,
        } as React.CSSProperties} 
      />
      <defs>
        <radialGradient id="paint0_radial_5290_1374" cx="0" cy="0" r="1" gradientTransform="matrix(-440.596 -7.04288 -3.68221 254.626 460.596 -33.9571)" gradientUnits="userSpaceOnUse" colorInterpolation="sRGB">
          <stop stopColor="#DFDFDF" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#9F9F9F" stopOpacity="0.4" />
          <stop offset="0.733914" stopColor="#9F9F9F" stopOpacity="0.2" />
          <stop offset="0.9" stopColor="#808080" stopOpacity="0.1" />
          <stop offset="1" stopColor="#808080" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

