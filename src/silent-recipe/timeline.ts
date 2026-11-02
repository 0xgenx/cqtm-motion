import type { SilentRecipeProps, SilentShot } from "./types";

export const DEFAULT_COUNTER_SECONDS = 3;
export const DEFAULT_ASMR_SLOW_MOTION = 0.5;

export type TimedShot = SilentShot & {
  startFrame: number;
  durationInFrames: number;
  playbackRate: number;
};

/**
 * Calcule la frame d'entrée, la durée et la vitesse de chaque plan.
 * En variante "tiktok", un plan ASMR garde la même portion de rush mais la
 * joue au ralenti : sa durée à l'écran est divisée par la vitesse.
 */
export function buildTimeline(
  props: Pick<SilentRecipeProps, "shots" | "variant" | "asmrSlowMotion">,
  fps: number
): TimedShot[] {
  const slow = props.asmrSlowMotion ?? DEFAULT_ASMR_SLOW_MOTION;
  let cursor = 0;

  return props.shots.map((shot) => {
    const playbackRate = props.variant === "tiktok" && shot.asmr ? slow : 1;
    const durationInFrames = Math.max(
      1,
      Math.round((shot.seconds * fps) / playbackRate)
    );
    const timed: TimedShot = {
      ...shot,
      startFrame: cursor,
      durationInFrames,
      playbackRate,
    };
    cursor += durationInFrames;
    return timed;
  });
}

export function totalDurationInFrames(
  props: Pick<SilentRecipeProps, "shots" | "variant" | "asmrSlowMotion" | "counter">,
  fps: number
): number {
  const shotsFrames = buildTimeline(props, fps).reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );
  const counterFrames = Math.round(
    (props.counter.seconds ?? DEFAULT_COUNTER_SECONDS) * fps
  );
  return shotsFrames + counterFrames;
}
