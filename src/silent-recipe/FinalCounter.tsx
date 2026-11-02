import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SfxCue } from "../sfx/SfxCue";
import type { SilentCounter } from "./types";

/**
 * Carton final sans langue : emoji + nombre qui défile + badges des additifs.
 * Seuls des chiffres, des symboles et des codes E (identiques aux numéros
 * INS du Codex Alimentarius) : lisible dans tous les pays.
 */
export const FinalCounter: React.FC<
  SilentCounter & { badgeSfxSrc?: string | null; endSfxSrc?: string | null }
> = ({
  value,
  suffix = "",
  emoji,
  badges = [],
  accentColor = "#F5A623",
  badgeSfxSrc,
  endSfxSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countEnd = Math.round(0.9 * fps);
  const shown = Math.round(
    interpolate(frame, [0, countEnd], [0, value ?? 0], {
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })
  );
  const numberPop = spring({ frame: frame - countEnd, fps, config: { damping: 9 } });
  const emojiIn = spring({ frame, fps, config: { damping: 12 } });

  const badgeStart = countEnd + Math.round(0.2 * fps);
  const badgeGap = Math.round(0.18 * fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0B0F",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {emoji && (
        <div style={{ fontSize: 180, transform: `scale(${emojiIn})` }}>{emoji}</div>
      )}
      <div
        style={{
          fontSize: 300,
          fontWeight: 900,
          color: "#F5EEE1",
          lineHeight: 1,
          transform: `scale(${1 + 0.08 * numberPop * (1 - numberPop)})`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value === null ? "?" : shown}
        <span style={{ color: accentColor }}>{suffix}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          marginTop: 70,
          maxWidth: 900,
        }}
      >
        {badges.map((badge, i) => {
          const s = spring({
            frame: frame - (badgeStart + i * badgeGap),
            fps,
            config: { damping: 10 },
          });
          return (
            <div
              key={badge}
              style={{
                transform: `scale(${s})`,
                padding: "14px 34px",
                borderRadius: 999,
                border: `4px solid ${accentColor}`,
                color: accentColor,
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {badge}
            </div>
          );
        })}
      </div>

      {endSfxSrc && <SfxCue src={endSfxSrc} startFrame={countEnd} />}
      {badgeSfxSrc &&
        badges.map((badge, i) => (
          <SfxCue
            key={`sfx-${badge}`}
            src={badgeSfxSrc}
            startFrame={badgeStart + i * badgeGap}
            volume={0.7}
          />
        ))}
    </AbsoluteFill>
  );
};
