import { StoryComposition } from "./Composition";
import { DemoCompositions } from "./DemoCompositions";
import { SilentRecipeCompositions } from "./silent-recipe/SilentRecipeCompositions";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <StoryComposition />
      <DemoCompositions />
      <SilentRecipeCompositions />
    </>
  );
};
