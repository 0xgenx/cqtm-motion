import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Carton affiché à la place d'un plan tant que le rush Grok n'existe pas :
 * permet de caler le rythme, les bruitages et la durée totale avant de
 * dépenser le moindre crédit de génération.
 */
export const ShotPlaceholder: React.FC<{
  index: number;
  description: string;
  plannedClip?: string;
  asmr?: boolean;
}> = ({ index, description, plannedClip, asmr }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Barre de progression du plan, pour sentir sa durée en prévisualisation.
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Alterne deux teintes d'un plan à l'autre pour voir chaque coupe.
  const background = index % 2 === 0 ? "#12151C" : "#1A1410";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
        fontFamily: "Poppins, sans-serif",
        color: "#F5EEE1",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 150, fontWeight: 800, opacity: 0.25 }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.3, marginTop: 30 }}>
        {description}
      </div>
      {asmr && (
        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            fontWeight: 700,
            color: "#F5A623",
            letterSpacing: "0.2em",
          }}
        >
          ASMR
        </div>
      )}
      {plannedClip && (
        <div style={{ position: "absolute", bottom: 160, fontSize: 32, opacity: 0.5 }}>
          rush : {plannedClip}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 90,
          right: 90,
          height: 8,
          borderRadius: 4,
          backgroundColor: "rgba(245,238,225,0.15)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 4,
            backgroundColor: "#F5EEE1",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
