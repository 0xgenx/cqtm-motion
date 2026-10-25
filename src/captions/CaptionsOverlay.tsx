import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Caption } from "@remotion/captions";

/**
 * Affiche les sous-titres produits par pipeline/captions/transcribe.ts,
 * mot par mot, façon karaoké TikTok. Charge le JSON de captions en prop
 * (import direct ou staticFile selon où tu le ranges).
 *
 * Usage :
 * import captions from "../../public/audio/mon-clip.captions.json";
 * <CaptionsOverlay captions={captions} />
 */
export const CaptionsOverlay: React.FC<{
  captions: Caption[];
  accentColor?: string;
}> = ({ captions, accentColor = "#FF4D4D" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  const activeWindow = 2500; // ms de contexte affiché autour du mot courant
  const visible = captions.filter(
    (c) => timeMs >= c.startMs - activeWindow && timeMs <= c.endMs + 200
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 220,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "85%",
          gap: "0.3em",
        }}
      >
        {visible.map((caption, i) => {
          const active = timeMs >= caption.startMs && timeMs <= caption.endMs;
          const activationFrame = (caption.startMs / 1000) * fps;
          // Pop d'échelle piloté par la frame (pas de transition CSS, pas de flicker au rendu)
          const scale = interpolate(
            frame,
            [activationFrame, activationFrame + fps * 0.08],
            [active ? 1 : 1.08, active ? 1.08 : 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <span
              key={i}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: 54,
                color: active ? accentColor : "#F5EEE1",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                transform: `scale(${scale})`,
              }}
            >
              {caption.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
