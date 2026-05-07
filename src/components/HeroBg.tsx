"use client";

import SplineScene from "./SplineScene";

/**
 * Hero background with Spline 3D scene.
 *
 * Performance strategy:
 * - Desktop: Loads interactive 3D Spline scene (preloaded via layout.tsx)
 * - Mobile: SplineScene returns null, CSS shows gradient fallback
 */

const SCENE_URL = "https://prod.spline.design/DP5UKPIERCeiygCV/scene.splinecode";

export default function HeroBg() {
  return (
    <>
      {/* Gradient fallback — always present, visible on mobile via CSS */}
      <div className="spline-placeholder" />

      {/* 3D Spline scene — skips entirely on mobile by SplineScene */}
      <SplineScene scene={SCENE_URL} className="spline-canvas" />

      {/* Overlay to hide the "Built with Spline" watermark (shadow DOM workaround) */}
      <div className="spline-watermark-hide" />
    </>
  );
}
