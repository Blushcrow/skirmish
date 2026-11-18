import { useRef, useState, useEffect } from "react";
import styles from "./slider.module.scss";

interface SliderProps {
  delay: number;
  speed: number;
  hit: number;
  crit: number;
  duration?: number;
}

function Slider({ delay, speed, hit, crit, duration = 2000 }: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const [resultText, setResultText] = useState<string>("");
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const anim = el.animate(
      [
        { transform: "translateX(0cqw)" },
        { transform: "translateX(100cqw)" },
        { transform: "translateX(0cqw)" },
      ],
      {
        duration: duration,
        easing: "linear",
        iterations: Infinity,
      },
    );

    anim.playbackRate = speed > 0 ? speed : 1;
    animationRef.current = anim;
    return () => anim.cancel();
  }, []);

  function getResult() {
    const outcome =
      1 -
      Math.abs(
        (((animationRef.current?.effect?.getComputedTiming().progress ?? -delay / duration) +
          delay / duration) %
          1) -
          0.5,
      ) *
        2;

    setTimeout(() => {
      animationRef.current?.pause();
      setResultText(outcome >= 1 - hit ? (outcome >= 1 - hit * crit ? "Crit!" : "Hit!") : "Miss.");
      setTimeout(() => {
        animationRef.current?.play();
      }, 1000);
    }, delay);
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.rails}
        style={{
          backgroundImage: `linear-gradient(to right, var(--miss-color) ${(1 - hit) * 100}%, var(--accent) ${(1 - hit) * 100}% ${(1 - hit * crit) * 100}%, var(--crit-color) ${(1 - hit * crit) * 100}%)`,
        }}
      >
        <div ref={sliderRef} className={styles.slider}></div>
      </div>
      <div className={styles.controls}>
        <button onMouseDown={getResult}>Stop</button>
        <div className={styles.delay} style={{ width: `${(delay / duration) * 100}%` }}></div>
        <output>{resultText}</output>
      </div>
    </div>
  );
}

export default Slider;
