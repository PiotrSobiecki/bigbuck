"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";

export default function SecondSection() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Obliczamy pozycję sekcji względem viewport
  const getSectionProgress = () => {
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    // Zwiększamy zakres scrolla, aby animacja była bardziej rozciągnięta
    const start = viewportHeight * 1.2; // zaczyna się wcześniej
    const end = viewportHeight * -0.5; // kończy się później
    const progress = (start - rect.top) / (start - end);
    return Math.max(0, Math.min(1, progress));
  };

  const progress = getSectionProgress();

  // Funkcja do obliczania progressu dla każdego elementu z opóźnieniem
  const getElementProgress = (index: number, total: number) => {
    const step = 1 / total;
    const start = index * step;
    const end = start + step;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  };

  // Statystyki
  const stats = [
    {
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      number: "15+",
      text: "Years since Big Buck Bunny first hopped onto screens, bringing joy to millions worldwide.",
    },
    {
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      number: "50m+",
      text: "Views of Big Buck Bunny across platforms, making it one of the most watched open-source animations.",
    },
    {
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      number: "1",
      text: "Beloved character that started it all - Big Buck Bunny continues to inspire animators and audiences globally.",
    },
  ];

  // Tekst nagłówka podzielony na wiersze (ręcznie podzielony dla lepszego wyświetlania)
  const headingLines = [
    "We are the creators behind Big Buck Bunny, bringing to life",
    "the adventures of a gentle giant rabbit through animation and storytelling.",
  ];

  // Tekst paragrafu podzielony na wiersze (ręcznie podzielony dla lepszego wyświetlania)
  const paragraphLines = [
    "Big Buck Bunny represents our passion for open-source animation",
    "and creative storytelling. From the first sketches of our beloved",
    "rabbit character to the final animated sequences, we've dedicated",
    "ourselves to creating content that brings joy and wonder to millions.",
    "Our work on this project showcases the power of collaboration,",
    "technical excellence, and the magic of bringing animated characters",
    "to life. Join us in celebrating the world of Big Buck Bunny.",
  ];

  // Liczba elementów do animacji (label, heading, paragraph, stats)
  const totalElements = 4;

  return (
    <section ref={sectionRef} className={styles.secondSection}>
      <div className={styles.secondSectionContent}>
        {/* Label */}
        <div
          className={styles.secondSectionLabel}
          style={{
            opacity: getElementProgress(0, totalElements),
            transform: `translateY(${
              30 * (1 - getElementProgress(0, totalElements))
            }px)`,
          }}
        >
          <span className={styles.secondSectionDot}>•</span>
          WHAT WE DO
        </div>

        {/* Heading - każda linia jako osobna sekcja */}
        <h2 className={styles.secondSectionHeading}>
          {headingLines.map((line, lineIndex) => {
            // Obliczamy progress bezpośrednio dla każdej linii na podstawie pozycji sekcji
            if (!sectionRef.current) return null;
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Każda linia heading ma swój zakres scrolla - zaczynają się od początku sekcji
            // Używamy prostszej logiki: każda linia zaczyna się gdy poprzednia się kończy
            const lineScrollRange = viewportHeight * 0.3; // zakres scrolla na linię
            const lineScrollStart =
              viewportHeight * 0.8 - lineIndex * lineScrollRange; // Zmniejszamy z 1.2 do 0.8, aby zaczynało się wcześniej
            const lineScrollEnd = lineScrollStart - lineScrollRange;

            // Progress dla tej konkretnej linii
            let lineProgress = 0;
            if (rect.top <= lineScrollStart) {
              if (rect.top <= lineScrollEnd) {
                lineProgress = 1; // Linia już się zakończyła - pełna widoczność
              } else {
                // Linia jest w trakcie animacji
                lineProgress =
                  (lineScrollStart - rect.top) /
                  (lineScrollStart - lineScrollEnd);
                lineProgress = Math.max(0, Math.min(1, lineProgress));
              }
            }

            const blurAmount = 10 * (1 - lineProgress);
            const opacity = lineProgress;
            const transform = `translateY(${30 * (1 - lineProgress)}px)`;

            return (
              <div
                key={`heading-line-${lineIndex}`}
                className={styles.secondSectionLine}
                style={{
                  opacity,
                  transform,
                  filter: `blur(${blurAmount}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
        </h2>

        {/* Paragraph - każda linia jako osobna sekcja */}
        <div className={styles.secondSectionParagraph}>
          {paragraphLines.map((line, lineIndex) => {
            // Obliczamy progress bezpośrednio dla każdej linii na podstawie pozycji sekcji
            if (!sectionRef.current) return null;
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Paragraph zaczyna się po heading (4 linie heading * 0.3vh każda)
            // Każda linia paragraph ma swój zakres scrolla - zmniejszamy zakres, aby animacja była szybsza
            const headingLinesCount = headingLines.length;
            const headingOffset = viewportHeight * 0.25 * headingLinesCount;
            const lineScrollRange = viewportHeight * 0.1; // Zmniejszamy z 0.2 do 0.12, aby animacja była szybsza
            const lineScrollStart =
              viewportHeight * 0.8 - // Zmniejszamy z 1.2 do 0.8, aby zaczynało się wcześniej
              headingOffset -
              lineIndex * lineScrollRange;
            const lineScrollEnd = lineScrollStart - lineScrollRange;

            // Progress dla tej konkretnej linii
            let lineProgress = 0;
            if (rect.top <= lineScrollStart) {
              if (rect.top <= lineScrollEnd) {
                lineProgress = 1; // Linia już się zakończyła - pełna widoczność, bez bluru
              } else {
                // Linia jest w trakcie animacji
                lineProgress =
                  (lineScrollStart - rect.top) /
                  (lineScrollStart - lineScrollEnd);
                lineProgress = Math.max(0, Math.min(1, lineProgress));
              }
            }

            const blurAmount = 10 * (1 - lineProgress);
            const opacity = lineProgress;
            const transform = `translateY(${30 * (1 - lineProgress)}px)`;

            return (
              <div
                key={`paragraph-line-${lineIndex}`}
                className={styles.secondSectionLine}
                style={{
                  opacity,
                  transform,
                  filter: `blur(${blurAmount}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className={styles.secondSectionStats}>
          {(() => {
            // Obliczamy progress dla wszystkich statystyk jednocześnie
            if (!sectionRef.current) return null;
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Statystyki zaczynają się po paragrafie
            const paragraphLinesCount = paragraphLines.length;
            const paragraphOffset = viewportHeight * 0.01 * paragraphLinesCount;
            const headingLinesCount = headingLines.length;
            const headingOffset = viewportHeight * 0.3 * headingLinesCount;
            const totalOffset = headingOffset + paragraphOffset;

            const statScrollRange = viewportHeight * 0.5; // zakres scrolla dla wszystkich statystyk
            const statScrollStart = viewportHeight * 0.8 - totalOffset;
            const statScrollEnd = statScrollStart - statScrollRange;

            // Progress dla wszystkich statystyk (ten sam dla wszystkich)
            let statProgress = 0;
            if (rect.top <= statScrollStart) {
              if (rect.top <= statScrollEnd) {
                statProgress = 1; // Statystyki już się zakończyły - pełna widoczność
              } else {
                // Statystyki są w trakcie animacji
                statProgress =
                  (statScrollStart - rect.top) /
                  (statScrollStart - statScrollEnd);
                statProgress = Math.max(0, Math.min(1, statProgress));
              }
            }

            const blurAmount = 10 * (1 - statProgress);
            const opacity = statProgress;
            const transform = `translateY(${30 * (1 - statProgress)}px)`;

            return stats.map((stat, index) => (
              <div
                key={index}
                className={styles.secondSectionStat}
                style={{
                  opacity,
                  transform,
                  filter: `blur(${blurAmount}px)`,
                }}
              >
                <div className={styles.secondSectionStatIcon}>{stat.icon}</div>
                <div className={styles.secondSectionStatNumber}>
                  {stat.number}
                </div>
                <div className={styles.secondSectionStatText}>{stat.text}</div>
              </div>
            ));
          })()}
        </div>
      </div>
    </section>
  );
}
