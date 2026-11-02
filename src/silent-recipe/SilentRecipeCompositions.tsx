import React from "react";
import { Composition } from "remotion";
import { SilentRecipe } from "./SilentRecipe";
import { nuggetPilotProps } from "./nuggetPilot";
import { totalDurationInFrames } from "./timeline";
import type { SilentRecipeProps } from "./types";

const fps = 30;

/**
 * Deux sorties depuis les mêmes rushes :
 * - Reels/Shorts : rythme de référence (~45 s, comme le reel analysé).
 * - TikTok : plans ASMR au ralenti pour passer la minute.
 * La durée se recalcule toute seule quand on modifie les plans.
 */
export const SilentRecipeCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="SilentRecipe-Nugget-Reels"
        component={SilentRecipe}
        fps={fps}
        width={1080}
        height={1920}
        durationInFrames={1}
        defaultProps={nuggetPilotProps}
        calculateMetadata={({ props }: { props: SilentRecipeProps }) => ({
          durationInFrames: totalDurationInFrames(props, fps),
        })}
      />
      <Composition
        id="SilentRecipe-Nugget-TikTok"
        component={SilentRecipe}
        fps={fps}
        width={1080}
        height={1920}
        durationInFrames={1}
        defaultProps={{ ...nuggetPilotProps, variant: "tiktok" as const }}
        calculateMetadata={({ props }: { props: SilentRecipeProps }) => ({
          durationInFrames: totalDurationInFrames(props, fps),
        })}
      />
    </>
  );
};
