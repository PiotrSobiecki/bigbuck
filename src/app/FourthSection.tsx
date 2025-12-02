"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";

export default function FourthSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Sprawdzamy czy sekcja 3 jest na ostatnim slajdzie i przewinięta do dołu
      const thirdSection = document.querySelector(`.${styles.thirdSection}`);
      if (!thirdSection) return;

      const thirdSectionRect = thirdSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Sprawdzamy czy sekcja 3 jest przewinięta do dołu
      const isThirdSectionAtBottom =
        thirdSectionRect.top < 0 && thirdSectionRect.bottom <= viewportHeight;

      // Sprawdzamy czy Swiper w sekcji 3 jest na ostatnim slajdzie
      // Sprawdzamy progress bar - jeśli jest na 100% lub blisko, to jesteśmy na ostatnim slajdzie
      const progressBar = thirdSection.querySelector(
        `.${styles.thirdSectionProgressFill}`
      ) as HTMLElement;
      let isOnLastSlide = false;

      if (progressBar) {
        const width = progressBar.style.width;
        const progressValue = parseFloat(width);
        // Sprawdzamy czy progress jest blisko 100% (z tolerancją)
        isOnLastSlide = progressValue >= 95;
      }

      // Alternatywnie sprawdzamy czy pagination pokazuje [3/3]
      const pagination = thirdSection.querySelector(
        `.${styles.thirdSectionTilePagination}`
      );
      if (pagination && pagination.textContent?.includes("[3/3]")) {
        isOnLastSlide = true;
      }

      // Sekcja 4 może się przewijać tylko gdy sekcja 3 jest na ostatnim slajdzie i przewinięta do dołu
      setCanScroll(isThirdSectionAtBottom && isOnLastSlide);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    // Sprawdzamy też przy zmianie slajdu w sekcji 3
    const interval = setInterval(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Zdjęcia po lewej stronie - wjeżdżają w kolejności: 1, 3, 2, 4
  const leftImages = [
    {
      id: 1,
      src: "/bigbuck/image/images (1).jpg",
      order: 0, // pierwsze wjeżdża
    },
    {
      id: 3,
      src: "/bigbuck/image/images (3).jpg",
      order: 2, // trzecie wjeżdża
    },
    {
      id: 2,
      src: "/bigbuck/image/images (2).jpg",
      order: 1, // drugie wjeżdża
    },
    {
      id: 4,
      src: "/bigbuck/image/images (4).jpg",
      order: 3, // czwarte wjeżdża
    },
  ];

  // Zdjęcia po prawej stronie - wjeżdżają w kolejności: 2, 4, 1, 3
  const rightImages = [
    {
      id: 2,
      src: "/bigbuck/image/images (5).jpg",
      order: 0, // pierwsze wjeżdża
    },
    {
      id: 4,
      src: "/bigbuck/image/images.jpg",
      order: 1, // drugie wjeżdża
    },
    {
      id: 1,
      src: "/bigbuck/image/hq720.jpg",
      order: 2, // trzecie wjeżdża
    },
    {
      id: 3,
      src: "/bigbuck/image/sddefault.jpg",
      order: 3, // czwarte wjeżdża
    },
  ];

  // Obliczamy progress sekcji - tylko jeśli sekcja 3 jest zakończona
  const getSectionProgress = () => {
    if (!canScroll) return 0; // Nie pozwalamy na scrollowanie dopóki sekcja 3 nie jest zakończona
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Sekcja zaczyna się gdy jest w viewport - zwiększamy zakres scrolla
    // Progress działa w obie strony - zarówno przy scrollowaniu w dół jak i w górę
    const start = viewportHeight * 0.8;
    const end = -viewportHeight * 3; // Zwiększamy zakres, aby sekcja była dłuższa
    const progress = (start - rect.top) / (start - end);
    // Pozwalamy na progress > 1, aby zdjęcia mogły zniknąć, ale też na wartości ujemne dla scrollowania w górę
    return Math.max(-0.2, Math.min(progress, 1.2));
  };

  const progress = getSectionProgress();

  // Sprawdzamy czy wszystkie zdjęcia zniknęły
  // Najpóźniejsze zdjęcie zaczyna znikać przy progress ~0.8, więc wszystkie znikną przy progress > 1.0
  const allImagesGone = progress > 1.0;

  // Po zniknięciu wszystkich zdjęć zmieniamy tło na białe
  const isWhiteBackground = allImagesGone;

  // Animacja napisu - przez cały czas widoczny, po przewinięciu pojawia się od dołu
  let titleTranslateY = 0;
  let titleOpacity = 1;

  if (progress > 1.0) {
    // Gdy sekcja jest przewinięta, napis pojawia się od dołu
    const titleProgress = Math.max(0, Math.min(1, (progress - 1.0) / 0.2));
    titleTranslateY = (1 - titleProgress) * 200; // wjeżdża od dołu
    titleOpacity = titleProgress;
  }

  return (
    <section
      ref={sectionRef}
      className={`${styles.fourthSection} ${
        isWhiteBackground ? styles.fourthSectionWhite : ""
      }`}
    >
      <div className={styles.fourthSectionGrid}>
        {/* Lewa kolumna - zdjęcia */}
        <div className={styles.fourthSectionColumn}>
          {leftImages.map((image, index) => {
            // Każde zdjęcie wjeżdża z różnym opóźnieniem podczas scrollowania w górę
            const imageStart = image.order * 0.05; // Zmniejszone z 0.1 na 0.05 - zdjęcia pojawiają się wcześniej
            const imageVisibleEnd = imageStart + 0.2; // Zwiększony czas widoczności
            const imageEnd = imageStart + 0.35; // Zwiększony czas do całkowitego zniknięcia

            let imageProgress = 0;
            let opacity = 0;
            let translateY = 400; // zaczyna od dołu

            // Logika działa w obie strony - zarówno przy scrollowaniu w dół jak i w górę
            if (progress >= imageStart) {
              if (progress <= imageVisibleEnd) {
                // Faza wjeżdżania - od dołu do pozycji (działa w obie strony)
                const fadeInProgress =
                  (progress - imageStart) / (imageVisibleEnd - imageStart);
                translateY = (1 - fadeInProgress) * 400;
                opacity = fadeInProgress;
              } else if (progress <= imageEnd) {
                // Faza widoczności - na miejscu, potem zaczyna znikać
                translateY = 0;
                opacity = 1;
                // Potem zaczyna znikać (działa w obie strony)
                const fadeOutProgress =
                  (progress - imageVisibleEnd) / (imageEnd - imageVisibleEnd);
                opacity = Math.max(0, Math.min(1, 1 - fadeOutProgress));
                translateY = fadeOutProgress * -200; // przesuwa się w górę podczas znikania
              } else {
                // Zdjęcie zniknęło
                translateY = -200;
                opacity = 0;
              }
            } else {
              // Gdy progress < imageStart - zdjęcie jest ukryte, ale może wjeżdżać od góry przy scrollowaniu w górę
              // Jeśli scrollujemy w górę (progress maleje), zdjęcie może pojawić się od góry
              if (progress > imageStart - 0.1) {
                const fadeInProgress = Math.max(
                  0,
                  (progress - (imageStart - 0.1)) / 0.1
                );
                translateY = -200 + fadeInProgress * 200; // wjeżdża od góry
                opacity = fadeInProgress;
              } else {
                translateY = -200;
                opacity = 0;
              }
            }

            return (
              <div
                key={`left-${image.id}`}
                className={styles.fourthSectionImageWrapper}
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity,
                  marginBottom: "40px",
                }}
              >
                <img
                  src={image.src}
                  alt={`Image ${image.id}`}
                  className={styles.fourthSectionImage}
                />
              </div>
            );
          })}
        </div>

        {/* Lewa-środek kolumna - zdjęcia */}
        <div className={styles.fourthSectionColumn}>
          {leftImages
            .slice()
            .reverse()
            .map((image, index) => {
              const imageStart = (index + 0.5) * 0.05; // Zmniejszone z 0.1 na 0.05
              const imageVisibleEnd = imageStart + 0.2; // Zwiększony czas widoczności
              const imageEnd = imageStart + 0.35; // Zwiększony czas do całkowitego zniknięcia

              let translateY = 400;
              let opacity = 0;

              // Logika działa w obie strony - zarówno przy scrollowaniu w dół jak i w górę
              if (progress >= imageStart) {
                if (progress <= imageVisibleEnd) {
                  const fadeInProgress =
                    (progress - imageStart) / (imageVisibleEnd - imageStart);
                  translateY = (1 - fadeInProgress) * 400;
                  opacity = fadeInProgress;
                } else if (progress <= imageEnd) {
                  translateY = 0;
                  opacity = 1;
                  const fadeOutProgress =
                    (progress - imageVisibleEnd) / (imageEnd - imageVisibleEnd);
                  opacity = Math.max(0, Math.min(1, 1 - fadeOutProgress));
                  translateY = fadeOutProgress * -200;
                } else {
                  translateY = -200;
                  opacity = 0;
                }
              } else {
                if (progress > imageStart - 0.1) {
                  const fadeInProgress = Math.max(
                    0,
                    (progress - (imageStart - 0.1)) / 0.1
                  );
                  translateY = -200 + fadeInProgress * 200;
                  opacity = fadeInProgress;
                } else {
                  translateY = -200;
                  opacity = 0;
                }
              }

              return (
                <div
                  key={`left-center-${image.id}`}
                  className={styles.fourthSectionImageWrapper}
                  style={{
                    transform: `translateY(${translateY}px)`,
                    opacity,
                    marginBottom: "40px",
                  }}
                >
                  <img
                    src={image.src}
                    alt={`Image ${image.id}`}
                    className={styles.fourthSectionImage}
                  />
                </div>
              );
            })}
        </div>

        {/* Środkowa kolumna - napis */}
        <div className={styles.fourthSectionColumnCenter}>
          <div
            className={styles.fourthSectionText}
            style={{
              transform: `translateY(${titleTranslateY}px)`,
              opacity: titleOpacity,
            }}
          >
            <h2
              className={styles.fourthSectionTitle}
              style={{
                color: isWhiteBackground ? "#111111" : "#ffffff",
                textShadow: isWhiteBackground
                  ? "none"
                  : "0 2px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              Let's make things happen.
            </h2>
          </div>
        </div>

        {/* Prawa-środek kolumna - zdjęcia */}
        <div className={styles.fourthSectionColumn}>
          {rightImages.map((image, index) => {
            const imageStart = (index + 0.3) * 0.05; // Zmniejszone z 0.1 na 0.05
            const imageVisibleEnd = imageStart + 0.2; // Zwiększony czas widoczności
            const imageEnd = imageStart + 0.35; // Zwiększony czas do całkowitego zniknięcia

            let translateY = 400;
            let opacity = 0;

            if (progress >= imageStart) {
              if (progress <= imageVisibleEnd) {
                const fadeInProgress =
                  (progress - imageStart) / (imageVisibleEnd - imageStart);
                translateY = (1 - fadeInProgress) * 400;
                opacity = fadeInProgress;
              } else if (progress <= imageEnd) {
                translateY = 0;
                opacity = 1;
                const fadeOutProgress =
                  (progress - imageVisibleEnd) / (imageEnd - imageVisibleEnd);
                opacity = 1 - fadeOutProgress;
                translateY = fadeOutProgress * -200;
              } else {
                translateY = -200;
                opacity = 0;
              }
            }

            return (
              <div
                key={`right-center-${image.id}`}
                className={styles.fourthSectionImageWrapper}
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity,
                  marginBottom: "40px",
                }}
              >
                <img
                  src={image.src}
                  alt={`Image ${image.id}`}
                  className={styles.fourthSectionImage}
                />
              </div>
            );
          })}
        </div>

        {/* Prawa kolumna - zdjęcia */}
        <div className={styles.fourthSectionColumn}>
          {rightImages
            .slice()
            .reverse()
            .map((image, index) => {
              const imageStart = (index + 0.7) * 0.03; // Zmniejszone z 0.1 na 0.05
              const imageVisibleEnd = imageStart + 0.2; // Zwiększony czas widoczności
              const imageEnd = imageStart + 0.35; // Zwiększony czas do całkowitego zniknięcia

              let translateY = 400;
              let opacity = 0;

              // Logika działa w obie strony - zarówno przy scrollowaniu w dół jak i w górę
              if (progress >= imageStart) {
                if (progress <= imageVisibleEnd) {
                  const fadeInProgress =
                    (progress - imageStart) / (imageVisibleEnd - imageStart);
                  translateY = (1 - fadeInProgress) * 400;
                  opacity = fadeInProgress;
                } else if (progress <= imageEnd) {
                  translateY = 0;
                  opacity = 1;
                  const fadeOutProgress =
                    (progress - imageVisibleEnd) / (imageEnd - imageVisibleEnd);
                  opacity = Math.max(0, Math.min(1, 1 - fadeOutProgress));
                  translateY = fadeOutProgress * -200;
                } else {
                  translateY = -200;
                  opacity = 0;
                }
              } else {
                if (progress > imageStart - 0.1) {
                  const fadeInProgress = Math.max(
                    0,
                    (progress - (imageStart - 0.1)) / 0.1
                  );
                  translateY = -200 + fadeInProgress * 200;
                  opacity = fadeInProgress;
                } else {
                  translateY = -200;
                  opacity = 0;
                }
              }

              return (
                <div
                  key={`right-${image.id}`}
                  className={styles.fourthSectionImageWrapper}
                  style={{
                    transform: `translateY(${translateY}px)`,
                    opacity,
                    marginBottom: "40px",
                  }}
                >
                  <img
                    src={image.src}
                    alt={`Image ${image.id}`}
                    className={styles.fourthSectionImage}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
