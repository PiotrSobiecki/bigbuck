"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Lenis from "lenis";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./page.module.css";

export default function ThirdSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [slideProgress, setSlideProgress] = useState<number[]>([]);
  const [isSectionAtBottom, setIsSectionAtBottom] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isHorizontalScrollBlocked = useRef(false);
  const lastWheelTime = useRef(0);
  const unlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const projects = [
    {
      id: 1,
      title: "Big Buck Bunny",
      category: "PROJECT 01",
      description:
        "The original open-source animated short film featuring our gentle giant rabbit. A heartwarming story of friendship, adventure, and the magic of animated storytelling that has captivated millions worldwide.",
      location: "ANIMATION STUDIO",
      client: "BLENDER FOUNDATION",
      agency: "CHARACTER DESIGN",
      image: "/bigbuck/image/poster_rodents_bunnysize.jpg",
    },
    {
      id: 2,
      title: "The Forest Friends",
      category: "PROJECT 02",
      description:
        "Meet the charming cast of characters from Big Buck Bunny's world - from playful butterflies to curious squirrels, each brought to life through meticulous animation and character design.",
      location: "ANIMATION STUDIO",
      client: "BLENDER FOUNDATION",
      agency: "ANIMATION DIRECTION",
      image: "/bigbuck/image/maxresdefault.jpg",
    },
    {
      id: 3,
      title: "Bunny's Adventures",
      category: "PROJECT 03",
      description:
        "Exploring the animated world of Big Buck Bunny through detailed character studies, environment design, and the technical artistry that makes this beloved character come alive on screen.",
      location: "ANIMATION STUDIO",
      client: "BLENDER FOUNDATION",
      agency: "CREATIVE DIRECTION",
      image: "/bigbuck/image/Big_Buck_Bunny_loves_Creative_Commons.png",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Inicjalizacja Lenis dla smooth scrollowania
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Funkcja animacji Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const checkSectionPosition = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Sekcja jest całkowicie przewinięta do dołu gdy:
      // - góra sekcji jest powyżej viewport (rect.top < 0)
      // - dół sekcji jest na dole viewport lub poniżej (rect.bottom <= viewportHeight)
      const isScrolledToBottom = rect.top < 0 && rect.bottom <= viewportHeight;

      setIsSectionAtBottom(isScrolledToBottom);
    };

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Sprawdzamy czy sekcja 3 jest widoczna w viewport
      const isSectionVisible = rect.top < viewportHeight && rect.bottom > 0;

      if (!isSectionVisible) {
        // Jeśli sekcja nie jest widoczna, pozwalamy na normalny scroll
        isHorizontalScrollBlocked.current = false;
        if (lenisRef.current) {
          lenisRef.current.start();
        }
        return;
      }

      const swiper = swiperRef.current;
      if (!swiper) return;

      const isAtStart = swiper.isBeginning;
      const isAtEnd = swiper.isEnd;

      // Sprawdzamy pozycję sekcji - PROSTA LOGIKA
      const isAtBottom = rect.top < 0 && rect.bottom <= viewportHeight; // Sekcja dojechała do końca (do dołu)
      const isAtTop = rect.top >= 0 && rect.top < viewportHeight; // Sekcja dojechała do góry

      // SCROLLOWANIE W DÓŁ (e.deltaY > 0)
      if (e.deltaY > 0) {
        // 1. Jeśli sekcja jest w punkcie przypięcia i nie jesteśmy na ostatnim slajdzie
        if (isAtBottom && !isAtEnd) {
          // BLOKUJEMY scroll w dół - TYLKO scroll w prawo
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Blokujemy Lenis całkowicie
          if (lenisRef.current) {
            lenisRef.current.stop();
            // Wymuszamy idealną pozycję przypięcia natychmiast
            const targetScroll =
              window.scrollY - (rect.bottom - viewportHeight);
            lenisRef.current.scrollTo(targetScroll, { immediate: true });
          }

          isHorizontalScrollBlocked.current = true;

          // Throttle
          const now = Date.now();
          if (now - lastWheelTime.current < 300) {
            return;
          }
          lastWheelTime.current = now;

          // Scroll w prawo
          swiper.slideNext();
          return;
        }

        // 2. Jeśli sekcja dojechała do końca i jesteśmy na ostatnim slajdzie - ODBlOKUJEMY scroll w dół (z opóźnieniem)
        if (isAtBottom && isAtEnd) {
          // Czasowa blokada - odblokowujemy po 100ms, żeby nie było wrażenia że od razu scrolluje w dół
          if (unlockTimeoutRef.current) {
            clearTimeout(unlockTimeoutRef.current);
          }
          unlockTimeoutRef.current = setTimeout(() => {
            isHorizontalScrollBlocked.current = false;
            if (lenisRef.current) {
              lenisRef.current.start();
            }
          }, 100);
          return;
        }

        // Jeśli sekcja nie dojechała jeszcze do końca - normalny scroll w dół
        // Wznawiamy Lenis na wszelki wypadek, jeśli był zatrzymany
        isHorizontalScrollBlocked.current = false;
        if (lenisRef.current) {
          lenisRef.current.start();
        }
        return;
      }

      // SCROLLOWANIE W GÓRĘ (e.deltaY < 0)
      if (e.deltaY < 0) {
        // 1. Jeśli sekcja dojechała do góry i nie jesteśmy na pierwszym slajdzie
        if (isAtTop && !isAtStart) {
          // BLOKUJEMY scroll w górę - TYLKO scroll w lewo
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Blokujemy Lenis całkowicie
          if (lenisRef.current) {
            lenisRef.current.stop();
            // Wymuszamy idealną pozycję przypięcia natychmiast
            const targetScroll = window.scrollY + rect.top;
            lenisRef.current.scrollTo(targetScroll, { immediate: true });
          }

          isHorizontalScrollBlocked.current = true;

          // Throttle
          const now = Date.now();
          if (now - lastWheelTime.current < 300) {
            return;
          }
          lastWheelTime.current = now;

          // Scroll w lewo
          swiper.slidePrev();
          return;
        }

        // 3. Jeśli sekcja dojechała do góry i jesteśmy na pierwszym slajdzie - ODBlOKUJEMY scroll w górę (z opóźnieniem)
        if (isAtTop && isAtStart) {
          // Czasowa blokada - odblokowujemy po 300ms, żeby nie było wrażenia że od razu scrolluje w górę
          if (unlockTimeoutRef.current) {
            clearTimeout(unlockTimeoutRef.current);
          }
          unlockTimeoutRef.current = setTimeout(() => {
            isHorizontalScrollBlocked.current = false;
            if (lenisRef.current) {
              lenisRef.current.start();
            }
          }, 300);
          return;
        }

        // Jeśli sekcja nie dojechała jeszcze do góry - normalny scroll w górę
        if (!isAtTop) {
          isHorizontalScrollBlocked.current = false;
          if (lenisRef.current) {
            lenisRef.current.start();
          }
          return;
        }
      }
    };

    // Handler do wymuszania blokady - przywraca pozycję scroll gdy sekcja jest zablokowana
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const swiper = swiperRef.current;

      if (!swiper) return;

      const isAtStart = swiper.isBeginning;
      const isAtEnd = swiper.isEnd;
      const isAtTop = rect.top >= 0 && rect.top < viewportHeight;
      const isAtBottom = rect.top < 0 && rect.bottom <= viewportHeight;

      // Wymuszamy zatrzymanie Lenis i korektę pozycji, gdy sekcja powinna być przypięta
      if ((isAtBottom && !isAtEnd) || (isAtTop && !isAtStart)) {
        if (lenisRef.current) {
          lenisRef.current.stop();
          // Obliczamy idealną pozycję scrolla
          const targetScroll = isAtBottom
            ? window.scrollY - (rect.bottom - viewportHeight)
            : window.scrollY + rect.top;

          // Jeśli sekcja jest zablokowana, wymuszamy pozycję scroll
          if (isHorizontalScrollBlocked.current) {
            lenisRef.current.scrollTo(targetScroll, { immediate: true });
          }
        }
      } else {
        // Jeśli sekcja nie jest przypięta, upewniamy się, że Lenis działa
        if (lenisRef.current && !isHorizontalScrollBlocked.current) {
          lenisRef.current.start();
        }
      }
    };

    checkSectionPosition();
    window.addEventListener("scroll", checkSectionPosition, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: false });
    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener("resize", checkSectionPosition);

    return () => {
      window.removeEventListener("scroll", checkSectionPosition);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", checkSectionPosition);
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.thirdSection}>
      <Swiper
        modules={[Mousewheel, FreeMode]}
        direction="horizontal"
        spaceBetween={0}
        slidesPerView={1}
        speed={1200}
        mousewheel={false}
        freeMode={{
          enabled: false,
        }}
        effect="slide"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onProgress={(swiper) => {
          setScrollProgress(swiper.progress);
          // Progress dla każdego slajdu - używamy realIndex i progress
          const progress: number[] = [];
          const activeIndex = swiper.activeIndex;
          swiper.slides.forEach((_, index) => {
            if (index === activeIndex) {
              // Aktualny slajd - progress od 0 do 1
              progress.push(
                Math.abs(swiper.progress - Math.floor(swiper.progress))
              );
            } else if (index < activeIndex) {
              // Slajdy przed - już przeszły
              progress.push(1);
            } else {
              // Slajdy po - jeszcze nie przyszły
              progress.push(0);
            }
          });
          setSlideProgress(progress);
        }}
        onSlideChange={(swiper) => {
          setScrollProgress(swiper.progress);
          const progress: number[] = [];
          const activeIndex = swiper.activeIndex;
          swiper.slides.forEach((_, index) => {
            if (index === activeIndex) {
              progress.push(1);
            } else if (index < activeIndex) {
              progress.push(1);
            } else {
              progress.push(0);
            }
          });
          setSlideProgress(progress);
        }}
        onSetTransition={(swiper) => {
          // Aktualizuj podczas animacji
          const progress: number[] = [];
          const activeIndex = swiper.activeIndex;
          swiper.slides.forEach((_, index) => {
            if (index === activeIndex) {
              progress.push(
                Math.abs(swiper.progress - Math.floor(swiper.progress))
              );
            } else if (index < activeIndex) {
              progress.push(1);
            } else {
              progress.push(0);
            }
          });
          setSlideProgress(progress);
        }}
        className={styles.thirdSectionSwiper}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project.id} className={styles.thirdSectionSlide}>
            <div className={styles.thirdSectionTileContent}>
              <div
                className={styles.thirdSectionTileLeft}
                style={{
                  transform: slideProgress[index]
                    ? `translateX(${Math.max(0, slideProgress[index] * 350)}px)`
                    : "none",
                  transition: "transform 0.4s ease-out",
                }}
              >
                <div
                  className={styles.thirdSectionTileCategory}
                  style={{
                    opacity: slideProgress[index]
                      ? Math.max(0.8, 1 - slideProgress[index] * 0.2)
                      : 1,
                    transition: "opacity 0.1s ease-out",
                  }}
                >
                  {project.category}
                </div>
                <h2
                  className={styles.thirdSectionTileTitle}
                  style={{
                    opacity: slideProgress[index]
                      ? Math.max(0.8, 1 - slideProgress[index] * 0.2)
                      : 1,
                    transition: "opacity 0.1s ease-out",
                  }}
                >
                  {project.title}
                </h2>
                <div className={styles.thirdSectionTilePagination}>
                  [{index + 1}/{projects.length}]
                </div>
              </div>
              <div className={styles.thirdSectionTileRight}>
                <div className={styles.thirdSectionTileImage}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className={styles.thirdSectionTileImg}
                  />
                </div>
                <div className={styles.thirdSectionTileInfo}>
                  <div className={styles.thirdSectionTileInfoRow}>
                    <span>PRODUCTION</span>
                  </div>
                  <div className={styles.thirdSectionTileInfoRow}>
                    <span>{project.location}</span>
                  </div>
                  <div className={styles.thirdSectionTileInfoRow}>
                    <span>{project.agency}</span>
                  </div>
                  <div className={styles.thirdSectionTileInfoRow}>
                    <span>{project.client}</span>
                  </div>
                </div>
                <p className={styles.thirdSectionTileDescription}>
                  {project.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.thirdSectionProgressBar}>
        <div
          className={styles.thirdSectionProgressFill}
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </section>
  );
}
