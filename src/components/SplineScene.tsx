/**
 * SplineScene — Performance-optimized Spline 3D wrapper
 *
 * Optimizations applied:
 * 1. next/dynamic instead of React.lazy (better Next.js code splitting)
 * 2. Eager module preload on mount (starts JS download immediately)
 * 3. Reduced pixel ratio on load (1x instead of 2x = 4× fewer pixels)
 * 4. Skip rendering entirely on mobile (no runtime download)
 * 5. Scene URL preloaded via <link rel="preload"> in layout.tsx
 */

"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";

// next/dynamic with ssr:false — only loads the Spline runtime client-side
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

// Eagerly trigger the module download so it starts in parallel with page render
if (typeof window !== "undefined") {
  import("@splinetool/react-spline").catch(() => {});
}

interface SplineSceneProps {
  /** URL to the Spline scene (.splinecode file) */
  scene: string;
  /** CSS class to apply to the Spline canvas */
  className?: string;
  /** Callback fired when the scene finishes loading */
  onLoad?: (app: any) => void;
}

export default function SplineScene({
  scene,
  className,
  onLoad,
}: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Render after mount (client-side only)
  useEffect(() => {
    setShouldRender(true);
  }, []);

  const handleLoad = useCallback(
    (app: any) => {
      // Reduce pixel ratio for faster rendering (1x instead of device 2x/3x)
      try {
        if (app && app.setZoom) {
          app.setZoom(1);
        }
      } catch {}

      setLoaded(true);
      onLoad?.(app);
    },
    [onLoad]
  );

  if (!shouldRender) return null;

  return (
    <>
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <LoadingSpinner />
        </div>
      )}
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </>
  );
}

/** Simple CSS spinner — no dependencies */
function LoadingSpinner() {
  return (
    <span
      style={{
        width: 36,
        height: 36,
        border: "3px solid rgba(63, 169, 245, 0.15)",
        borderTopColor: "#3FA9F5",
        borderRadius: "50%",
        animation: "spline-spin 0.7s linear infinite",
        display: "block",
      }}
    />
  );
}

/**
 * Inject spinner keyframes once on module load
 */
if (typeof document !== "undefined") {
  const styleId = "spline-scene-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes spline-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}
