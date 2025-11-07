import { useState, useEffect } from 'react';

interface SVGData {
  content: string;
  viewBox: string;
}

const svgCache = new Map<string, SVGData>();

export function useInlineSVG(src: string | undefined): SVGData | null {
  const [svgData, setSvgData] = useState<SVGData | null>(null);

  useEffect(() => {
    if (!src) {
      setSvgData(null);
      return;
    }

    // Check cache first
    if (svgCache.has(src)) {
      setSvgData(svgCache.get(src)!);
      return;
    }

    // Fetch SVG content
    fetch(src)
      .then((response) => response.text())
      .then((text) => {
        // Extract the inner content and viewBox of the SVG
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        
        if (svgElement) {
          // Get the inner HTML of the SVG
          const innerHTML = svgElement.innerHTML;
          // Get the viewBox, or default to "0 0 100 100"
          const viewBox = svgElement.getAttribute('viewBox') || svgElement.getAttribute('viewbox') || '0 0 100 100';
          
          const data: SVGData = {
            content: innerHTML,
            viewBox: viewBox,
          };
          
          // Cache it
          svgCache.set(src, data);
          setSvgData(data);
        } else {
          setSvgData(null);
        }
      })
      .catch((error) => {
        console.error(`Failed to load SVG: ${src}`, error);
        setSvgData(null);
      });
  }, [src]);

  return svgData;
}

