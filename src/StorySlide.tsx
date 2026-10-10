import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type StorySlideProps = {
  title: string;
  subtitle?: string;
  slideNumber: number;
  totalSlides: number;
  accentColor?: string;
  backgroundColor?: string;
  numberPosition?: "bottom-left" | "bottom-right";
};

/**
 * Template de base "Story" (format 9:16, 1080x1920) pour CQTM / E-numbers / Ca vs Ca.
 * - Titre qui entre en fondu + léger scale (spring)
 * - Sous-titre optionnel
 * - Numéro de slide incrusté en bas (position configurable), comme demandé
 *   pour connaître l'ordre de publication des stories.
 */
export const StorySlide: React.FC<StorySlideProps> = ({
  title,
  subtitle,
  slideNumber,
  totalSlides,
  accentColor = "#FF4D4D",
  backgroundColor = "#0B0B0F",
  numberPosition = "bottom-right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.6 },
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);

  const subtitleOpacity = interpolate(
    frame,
    [fps * 0.3, fps * 0.3 + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const badgeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily:
          "Helvetica Neue, Helvetica, Arial, sans-serif",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
      }}
    >
      {/* Barre d'accent en haut */}
      <AbsoluteFill
        style={{
          top: 0,
          height: 12,
          background: accentColor,
        }}
      />

      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            color: "#FFFFFF",
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              opacity: subtitleOpacity,
              color: accentColor,
              fontSize: 44,
              fontWeight: 600,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* Numéro de slide — ordre de publication */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          [numberPosition === "bottom-right" ? "right" : "left"]: 48,
          opacity: badgeOpacity,
          backgroundColor: "rgba(255,255,255,0.1)",
          border: `2px solid ${accentColor}`,
          borderRadius: 999,
          padding: "10px 22px",
          color: "#FFFFFF",
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {slideNumber}/{totalSlides}
      </div>
    </AbsoluteFill>
  );
};
