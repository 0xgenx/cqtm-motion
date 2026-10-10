import { Composition } from "remotion";
import { StorySlide } from "./StorySlide";

const fps = 30;

export const StoryComposition: React.FC = () => {
  return (
    <Composition
      id="CQTM-Story"
      component={StorySlide}
      durationInFrames={5 * fps}
      fps={fps}
      width={1080}
      height={1920}
      defaultProps={{
        title: "E 322 — Lécithine",
        subtitle: "Cet additif, c'est quoi ?",
        slideNumber: 1,
        totalSlides: 5,
        accentColor: "#FF4D4D",
        backgroundColor: "#0B0B0F",
        numberPosition: "bottom-right",
      }}
    />
  );
};
