"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  // Paleta losowych kolorów (taka sama jak w FooterSection)
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
    if (isOpen) {
      const newColors: { [key: number]: string } = {};
      const itemsCount = menuItems.length;
      for (let index = 0; index < itemsCount; index++) {
        newColors[index] = getRandomColor();
      }
      setHoverColors(newColors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Funkcja obsługująca hover - losuje nowy kolor
  const handleMouseEnter = (index: number) => {
    setHoverColors((prev) => ({
      ...prev,
      [index]: getRandomColor(),
    }));
  };

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.menuModalOverlay} onClick={onClose}>
      <div
        className={styles.menuModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation */}
        <nav className={styles.menuModalNav}>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.sectionId}`}
              className={styles.menuModalNavItem}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.sectionId);
              }}
            >
              <div
                className={styles.menuModalNavItemBg}
                style={{
                  backgroundColor: hoverColors[index],
                }}
              />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Video w prawym dolnym rogu */}
        <div className={styles.menuModalVideo}>
          <video
            className={styles.menuModalVideoElement}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Footer */}
        <div className={styles.menuModalFooter}>
          <div className={styles.menuModalFooterLeft}>
            <span>©2025</span>
            <span>Privacy Policy | Cookies</span>
          </div>
          <div className={styles.menuModalFooterRight}>
            <span>Rembertów 4, 04-478 Warsaw, Poland</span>
            <span>hello@bigbuckbunny.art</span>
          </div>
        </div>
      </div>
    </div>
  );
}
