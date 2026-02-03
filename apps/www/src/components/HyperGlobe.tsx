import { useEffect, useRef } from "react";

// Use absolute paths so the library loads assets correctly (it only resolves relative URLs when baseurl starts with "http")
const GLOBE_BASE = "/globe";
const globeHtml = `
<style>
.globe-marker {
  opacity: 0.6;
}
.globe-marker::before {
  box-shadow: 0 0 12px 4px rgba(94, 184, 255, 0.6);
}
.marker-hover {
  opacity: 1;
  --marker-size: 1.6;
}
</style>
<hyper-globe id="hologram-globe" data-baseurl="/globe/" data-location="13.0803 -84.6565" data-version="17" style="width: 100%; height: 100%; min-width: 100%; min-height: 100%; display: block; --preview-size: 100%; --globe-scale:0.76; --globe-damping:0.5; --map-density:0.52; --map-height:0.5; --point-size:2.6; --point-color:#5eb8ff; --point-opacity:0.95; --backside-opacity:0.35; --backside-transition:0.5; --backside-color:#0d47a1; --marker-size:1.2; --text-color:#90caf9; --text-size:0.8; --line-color:#64b5f6; --line-offset:0.5; --line-thickness:1.5; --autorotate:true; --autorotate-speed:0.5; --autorotate-delay:4; --autorotate-latitude:10; --title-position:0 -1; --title-padding:1.2; --text-padding:0.5; --animation:offset; --animation-intensity:0.3; --animation-scale:0.8; --animation-speed:0.2; --globe-foreground:url('${GLOBE_BASE}/hologram-shine.svg'); --point-opacity-map:url('${GLOBE_BASE}/light.jpg'); --point-image:url('${GLOBE_BASE}/hologram-point.png'); --marker-image:url('${GLOBE_BASE}/hologram-marker.png'); --preview-color:#000000; --text-height:1.1; --point-color-blend:multiply; --equator:true; --islands:true; --marker-offset:0.2; max-width: 100%;">
  <a slot="markers" data-location="34 -118" title="Los Angeles" class="globe-marker"></a>
  <a slot="markers" data-location="-12 -77" title="Lima" class="globe-marker"></a>
  <a slot="markers" data-location="40 -74" title="New York" class="globe-marker"></a>
  <a slot="markers" data-location="52 4.8" title="Amsterdam" class="globe-marker"></a>
  <a slot="markers" data-location="28 77" title="New Delhi" class="globe-marker"></a>
  <a slot="markers" data-location="35.5 138.5" title="Tokyo" class="globe-marker"></a>
  <a slot="markers" data-location="-41 174" title="Wellington" class="globe-marker"></a>
</hyper-globe>
`;

interface HyperGlobeProps {
  className?: string;
}

export const HyperGlobe = ({ className }: HyperGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const insertGlobe = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = globeHtml;
      }
    };

    // Check if custom element is already defined
    if (customElements.get("hyper-globe")) {
      insertGlobe();
      return;
    }

    // Load the hyper-globe script if not already loaded
    const existingScript = document.querySelector('script[src="/globe/hyper-globe.min.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "/globe/hyper-globe.min.js";
      document.head.appendChild(script);
    }

    // Wait for custom element to be defined, then insert HTML
    customElements.whenDefined("hyper-globe").then(() => {
      insertGlobe();
    });
  }, []);

  return <div ref={containerRef} className={className} style={{ width: 900, height: 900 }} />;
};
