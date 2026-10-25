import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { StorySlide } from "./StorySlide";
import { AnimatedText } from "./text/AnimatedText";
import { ClipSequence } from "./transitions/ClipSequence";

const fps = 30;

/**
 * Démo : enchaîne deux StorySlide avec une transition "slide" puis une
 * transition "wipe". Remplace le montage manuel CapCut entre deux clips
 * par un enchaînement scriptable et réutilisable.
 */
export const ClipSequenceDemo: React.FC = () => {
  return (
    <ClipSequence
      clips={[
        {
          component: StorySlide,
          props: {
            title: "E 322 — Lécithine",
            subtitle: "Cet additif, c'est quoi ?",
            slideNumber: 1,
            totalSlides: 2,
            accentColor: "#FF4D4D",
            backgroundColor: "#0B0B0F",
          },
          durationInFrames: 2.5 * fps,
          transitionOut: "slide",
        },
        {
          component: StorySlide,
          props: {
            title: "Verdict : sans danger",
            subtitle: "Autorisé en Europe",
            slideNumber: 2,
            totalSlides: 2,
            accentColor: "#2ECC71",
            backgroundColor: "#0B0B0F",
          },
          durationInFrames: 2.5 * fps,
        },
      ]}
    />
  );
};

/**
 * Démo : texte choc animé (remotion-animated) sur fond plein, pour tester
 * rapidement un habillage/call-out sans monter toute une slide.
 */
export const AnimatedTextDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0B0F",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedText delay={10}>BANNI EN EUROPE</AnimatedText>
    </AbsoluteFill>
  );
};

export const DemoCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="Demo-ClipSequence-Transitions"
        component={ClipSequenceDemo}
        durationInFrames={5 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="Demo-AnimatedText"
        component={AnimatedTextDemo}
        durationInFrames={2 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
