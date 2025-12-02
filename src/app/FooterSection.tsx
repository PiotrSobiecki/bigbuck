"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function FooterSection() {
  // Paleta losowych kolorów
  const randomColors = [
    "#ff6b35", // Pomarańczowy
    "#4ecdc4", // Turkusowy
    "#95e1d3", // Miętowy
    "#f38181", // Różowy
    "#aa96da", // Fioletowy
    "#ffd93d", // Żółty
    "#6bcf7f", // Zielony
    "#ff8a80", // Czerwony
    "#80deea", // Błękitny
    "#ce93d8", // Lawendowy
    "#ffab91", // Brzoskwiniowy
    "#a5d6a7", // Jasny zielony
  ];

  const menuItems = [
    { name: "HOME", sectionId: "hero" },
    { name: "WHAT WE DO", sectionId: "what-we-do" },
    { name: "PROJECTS", sectionId: "projects" },
    { name: "LET'S MAKE THINGS HAPPEN", sectionId: "make-things-happen" },
    { name: "UP TO DATE", sectionId: "up-to-date" },
    { name: "GET IN TOUCH", sectionId: "get-in-touch" },
  ];

  // Funkcja do scrollowania do sekcji
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Funkcja do losowania koloru
  const getRandomColor = () => {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
  };

  // State dla kolorów każdego elementu menu - zaczynamy od stałych kolorów, aby uniknąć błędu hydratacji
  const [hoverColors, setHoverColors] = useState<{ [key: number]: string }>(
    () => {
      // Używamy stałych kolorów początkowych, aby uniknąć błędu hydratacji
      const initialColors: { [key: number]: string } = {};
      menuItems.forEach((_, index) => {
        initialColors[index] = randomColors[index % randomColors.length];
      });
      return initialColors;
    }
  );

  // Po zamontowaniu komponentu, losujemy nowe kolory tylko po stronie klienta
  useEffect(() => {
    const newColors: { [key: number]: string } = {};
    menuItems.forEach((_, index) => {
      newColors[index] = getRandomColor();
    });
    setHoverColors(newColors);
  }, []);

  // Funkcja obsługująca hover - losuje nowy kolor
  const handleMouseEnter = (index: number) => {
    setHoverColors((prev) => ({
      ...prev,
      [index]: getRandomColor(),
    }));
  };

  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          {/* Lewa kolumna */}
          <div className={styles.footerColumn}>
            <div className={styles.footerLogoCircle}>G</div>
            <div className={styles.footerTagline}>
              <span>OPEN SOURCE ANIMATION</span>
              <span>// CHARACTER STORYTELLING</span>
            </div>
            <p className={styles.footerDescription}>
              Creators of Big Buck Bunny, we bring animated characters to life
              through storytelling, character design, and technical excellence.
              Our work celebrates the magic of open-source animation and the joy
              of bringing beloved characters to screens worldwide.
            </p>
            <div className={styles.footerContact}>
              <p>Rembertów 4, 04-478 Warsaw, Poland</p>
              <p>hello@bigbuckbunny.art</p>
            </div>
            <div className={styles.footerSocial}>
              <a
                href="#"
                className={styles.footerSocialIcon}
                aria-label="Instagram"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className={styles.footerSocialIcon}
                aria-label="LinkedIn"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Środkowa kolumna - Menu */}
          <div className={styles.footerColumn}>
            <nav className={styles.footerNav}>
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.sectionId}`}
                  className={styles.footerNavItem}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.sectionId);
                  }}
                >
                  <div
                    className={styles.footerNavItemBg}
                    style={{
                      backgroundColor: hoverColors[index],
                    }}
                  />
                  <span>{item.name}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={styles.footerNavArrow}
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              ))}
            </nav>
          </div>

          {/* Prawa kolumna */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerCTAHeading}>
              Ready to explore the world of Big Buck Bunny?
            </h3>
            <p className={styles.footerCTAText}>
              Discover the stories, characters, and creative process behind one
              of the most beloved open-source animated characters.
            </p>
            <div className={styles.footerCopyright}>
              <span>BIG BUCK BUNNY ART LTD 2025 ©</span>
              <span>WEBSITE BY PHUNK</span>
            </div>
          </div>
        </div>

        {/* Duży napis na dole */}
        <div className={styles.footerTitle}>
          <h2 className={styles.footerTitleText}>BIG BUCK BUNNY</h2>
        </div>
      </div>
    </footer>
  );
}
