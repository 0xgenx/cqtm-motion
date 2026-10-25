import React from "react";
import { Audio, Sequence } from "remotion";

/**
 * Place un bruitage à une frame donnée dans la composition. Combine avec
 * useSfxManifest()/findSfx() pour synchroniser un son sur un cut, une
 * transition ou un texte qui claque.
 *
 * Usage :
 * const manifest = useSfxManifest();
 * const whoosh = findSfx(manifest, "whoosh");
 * {whoosh && <SfxCue src={whoosh} startFrame={60} />}
 */
export const SfxCue: React.FC<{
  src: string;
  startFrame: number;
  volume?: number;
}> = ({ src, startFrame, volume = 1 }) => {
  return (
    <Sequence from={startFrame} layout="none">
      <Audio src={src} volume={volume} />
    </Sequence>
  );
};
