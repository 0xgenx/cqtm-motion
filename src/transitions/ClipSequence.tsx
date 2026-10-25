import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SfxCue } from "../sfx/SfxCue";

/**
 * Enchaîne plusieurs clips (ex: rendus Grok/Aurora) avec des transitions pro,
 * au lieu d'un montage CapCut manuel. Chaque clip est un composant Remotion
 * (vidéo source, slide, ou habillage) avec sa propre durée en frames.
 *
 * Trois presets de transition prêts à l'emploi : "fade", "slide", "wipe".
 * Durée par défaut : 15 frames (0,5s à 30fps), ajustable par clip.
 */
export type ClipDefinition = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- clips mix components with different prop shapes (StorySlide, video, custom habillages)
  component: React.ComponentType<any>;
  props?: Record<string, unknown>;
  durationInFrames: number;
  transitionOut?: "fade" | "slide" | "wipe";
  transitionDurationInFrames?: number;
  /**
   * Chemin staticFile() d'un bruitage à jouer au moment du cut vers ce clip
   * (whoosh, impact, stamp...). Obtenu via `findSfx(manifest, "whoosh")`.
   * Ignoré pour le tout premier clip (rien à annoncer).
   */
  sfxOnEnter?: string | null;
};

const presets: Record<
  NonNullable<ClipDefinition["transitionOut"]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fade/slide/wipe each carry their own props shape
  () => TransitionPresentation<any>
> = {
  fade: () => fade(),
  slide: () => slide(),
  wipe: () => wipe(),
};

export const ClipSequence: React.FC<{ clips: ClipDefinition[] }> = ({
  clips,
}) => {
  // Pré-calcule la frame d'entrée de chaque clip pour caler les SFX dessus
  // (TransitionSeries chevauche chaque transition de `transitionDuration`
  // frames avec le clip précédent, donc l'entrée réelle du clip N+1 est
  // avancée de cette durée).
  let cursor = 0;
  const enterFrames = clips.map((clip, index) => {
    const enterFrame = cursor;
    const prev = clips[index - 1];
    const prevTransitionDuration = prev?.transitionDurationInFrames ?? 15;
    cursor +=
      clip.durationInFrames - (prev?.transitionOut ? prevTransitionDuration : 0);
    return enterFrame;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0F" }}>
      <TransitionSeries>
        {clips.map((clip, index) => {
          const Component = clip.component;
          const isLast = index === clips.length - 1;
          const transitionDuration = clip.transitionDurationInFrames ?? 15;

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={clip.durationInFrames}>
                <Component {...(clip.props ?? {})} />
              </TransitionSeries.Sequence>
              {!isLast && clip.transitionOut && (
                <TransitionSeries.Transition
                  presentation={presets[clip.transitionOut]()}
                  timing={
                    clip.transitionOut === "wipe"
                      ? springTiming({ durationInFrames: transitionDuration })
                      : linearTiming({ durationInFrames: transitionDuration })
                  }
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {clips.map(
        (clip, index) =>
          index > 0 &&
          clip.sfxOnEnter && (
            <SfxCue
              key={`sfx-${index}`}
              src={clip.sfxOnEnter}
              startFrame={enterFrames[index]}
            />
          )
      )}
    </AbsoluteFill>
  );
};
