"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    handleScroll();
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Po 250px scrolla: zwalniamy blokadę wideo i napisu - zaczynają się przewijać
  const videoUnlockThreshold = 250;
  const videoOffset = Math.max(0, scrollY - videoUnlockThreshold);
  // Napis BIG BUCK BUNNY przewija się razem z wideo (może z opóźnieniem)
  const titleOffset = videoOffset * 0.8; // 20% wolniej niż wideo
  const titleOpacity =
    scrollY > videoUnlockThreshold
      ? Math.max(0, 1 - (scrollY - videoUnlockThreshold) / 300)
      : 1; // napis znika stopniowo
  // Tekst przewija się z opóźnieniem (wolniej niż wideo)
  const textOffset = videoOffset * 0.6; // 40% wolniej niż wideo

  return (
    <section className={styles.heroSection}>
      {/* Jedno wspólne wideo jako tło całego hero - fixed do 250px, potem przewija się */}
      <video
        className={styles.heroVideo}
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: scrollY > videoUnlockThreshold ? "absolute" : "fixed",
          transform:
            scrollY > videoUnlockThreshold
              ? `translateY(-${videoOffset}px)`
              : "none",
        }}
      />

      {/* Warstwa z napisem, który wycina wideo z białego tła */}
      <div
        className={styles.heroTop}
        style={{
          transform:
            scrollY > videoUnlockThreshold
              ? `translateY(-${titleOffset}px)`
              : "none",
          opacity: titleOpacity,
        }}
      >
        <svg
          className={styles.titleSvg}
          viewBox="0 0 1600 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* maska: białe litery są "dziurami" w białym prostokącie */}
            <mask id="cg-cutout-mask">
              <rect x="0" y="0" width="1600" height="400" fill="white" />
              <text
                className={styles.titleText}
                x="50%"
                y="50%"
                textAnchor="middle"
                fill="black"
                fontSize="190"
                letterSpacing="5"
                transform="scale(1,1.7)"
              >
                BIG BUCK BUNNY
              </text>
            </mask>
          </defs>

          {/* Białe tło z wyciętymi literami – pod spodem widać jedno wideo */}
          <rect
            x="0"
            y="0"
            width="1600"
            height="400"
            fill="white"
            mask="url(#cg-cutout-mask)"
          />
        </svg>
      </div>

      {/* Warstwa z tekstem hero nad tym samym wideo */}
      <div
        className={styles.heroBottom}
        style={{
          transform:
            scrollY > videoUnlockThreshold
              ? `translateY(-${textOffset}px)`
              : "none",
        }}
      >
        <div className={styles.videoOverlay} />
        <div className={styles.videoContent}>
          <p className={styles.location}>ANIMATION STUDIO</p>
          <h2 className={styles.videoTitle}>
            Storytelling, animation, and the
            <br />
            magic of bringing characters to life.
          </h2>
        </div>
      </div>
    </section>
  );
}
