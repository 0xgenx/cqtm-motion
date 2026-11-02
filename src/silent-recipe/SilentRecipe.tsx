import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { findSfx, useSfxManifest } from "../sfx/sfx";
import { SfxCue } from "../sfx/SfxCue";
import { FinalCounter } from "./FinalCounter";
import { ShotPlaceholder } from "./ShotPlaceholder";
import { buildTimeline, type TimedShot } from "./timeline";
import type { SilentRecipeProps } from "./types";

/** Zoom d'impact : 1.08 → 1 sur les 6 premières frames du plan. */
const Punch: React.FC<{ enabled?: boolean; children: React.ReactNode }> = ({
  enabled,
  children,
}) => {
  const frame = useCurrentFrame();
  const scale = enabled
    ? interpolate(frame, [0, 6], [1.08, 1], { extrapolateRight: "clamp" })
    : 1;
  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

const Shot: React.FC<{ shot: TimedShot; index: number; clipVolume: number }> = ({
  shot,
  index,
  clipVolume,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Punch enabled={shot.punch}>
      {shot.src ? (
        <OffthreadVideo
          src={staticFile(shot.src)}
          trimBefore={Math.round((shot.from ?? 0) * fps)}
          playbackRate={shot.playbackRate}
          volume={clipVolume}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <ShotPlaceholder
          index={index}
          description={shot.description}
          plannedClip={shot.plannedClip}
          asmr={shot.asmr}
        />
      )}
    </Punch>
  );
};

/**
 * Recette muette : coupes franches (~1 plan/s), aucun texte hormis le
 * compteur final, bruitages calés sur chaque coupe. Les plans sans rush
 * s'affichent en cartons de prévisualisation.
 */
export const SilentRecipe: React.FC<SilentRecipeProps> = (props) => {
  const { fps } = useVideoConfig();
  const manifest = useSfxManifest();
  const timeline = buildTimeline(props, fps);
  const counterStart = timeline.reduce((sum, s) => sum + s.durationInFrames, 0);
  const counterFrames = Math.round((props.counter.seconds ?? 3) * fps);
  const clipVolume = props.clipVolume ?? 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0F" }}>
      {timeline.map((shot, index) => {
        const sfxSrc = shot.sfx ? findSfx(manifest, shot.sfx) : null;
        return (
          <React.Fragment key={index}>
            <Sequence
              from={shot.startFrame}
              durationInFrames={shot.durationInFrames}
              name={`${String(index + 1).padStart(2, "0")} ${shot.description}`}
            >
              <Shot shot={shot} index={index} clipVolume={clipVolume} />
            </Sequence>
            {sfxSrc && (
              <SfxCue
                src={sfxSrc}
                startFrame={shot.startFrame}
                volume={shot.sfxVolume ?? 1}
              />
            )}
          </React.Fragment>
        );
      })}

      <Sequence from={counterStart} durationInFrames={counterFrames} name="Compteur final">
        <FinalCounter
          {...props.counter}
          badgeSfxSrc={
            props.counter.badgeSfx ? findSfx(manifest, props.counter.badgeSfx) : null
          }
          endSfxSrc={props.counter.endSfx ? findSfx(manifest, props.counter.endSfx) : null}
        />
      </Sequence>

      {props.music && (
        <Audio src={staticFile(props.music)} volume={props.musicVolume ?? 0.5} />
      )}
    </AbsoluteFill>
  );
};
