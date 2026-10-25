import React from "react";
import { Animated, Fade, Move, Scale } from "remotion-animated";
import { SfxCue } from "../sfx/SfxCue";

/**
 * Texte choc réutilisable (titre, call-out, stat) avec entrée/sortie animées.
 * Remplace les effets "texte qui claque" codés à la main slide par slide.
 *
 * Usage :
 * <AnimatedText delay={10}>E 322 — LÉCITHINE</AnimatedText>
 *
 * Avec impact sonore synchronisé à l'entrée (trouvé via findSfx) :
 * <AnimatedText delay={10} sfx={findSfx(manifest, "impact")}>BANNI</AnimatedText>
 */
type AnimatedTextProps = {
  children: React.ReactNode;
  delay?: number;
  durationInFrames?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number | string;
  style?: React.CSSProperties;
  /** Chemin staticFile() d'un bruitage joué au frame `delay` (impact, swoosh...). */
  sfx?: string | null;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 0,
  durationInFrames = 20,
  fontSize = 64,
  color = "#F5EEE1",
  fontWeight = 800,
  style,
  sfx,
}) => {
  return (
    <>
      <Animated
        animations={[
          Fade({ to: 1, initial: 0, start: delay, duration: durationInFrames }),
          Move({ y: -30, initialY: 30, start: delay, duration: durationInFrames }),
          Scale({ by: 1, initial: 0.9, start: delay, duration: durationInFrames }),
        ]}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight,
          fontSize,
          color,
          letterSpacing: "0.02em",
          textAlign: "center",
          ...style,
        }}
      >
        {children}
      </Animated>
      {sfx && <SfxCue src={sfx} startFrame={delay} />}
    </>
  );
};
