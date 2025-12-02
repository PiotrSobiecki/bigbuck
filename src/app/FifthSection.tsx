"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";

export default function FifthSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

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

  // Obliczamy progress sekcji
  const getSectionProgress = () => {
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const start = viewportHeight * 0.8;
    const end = viewportHeight * -0.2;
    const progress = (start - rect.top) / (start - end);
    return Math.max(0, Math.min(1, progress));
  };

  const progress = getSectionProgress();
  const titleOpacity = progress;
  const titleTransform = 30 * (1 - progress);

  const projects = [
    {
      id: 1,
      title: "Big Buck Bunny Celebrates 15 Years",
      description:
        "Fifteen years of bringing joy to millions worldwide. Big Buck Bunny continues to inspire animators, filmmakers, and audiences with its timeless story of friendship and adventure in the animated forest.",
      image: "/bigbuck/image/poster_rodents_bunnysize.jpg",
    },
    {
      id: 2,
      title: "Behind the Scenes: Creating Big Buck Bunny",
      description:
        "Explore the creative process behind our beloved character - from initial sketches to final animation, discover how Big Buck Bunny came to life.",
      image: "/bigbuck/image/maxresdefault.jpg",
    },
    {
      id: 3,
      title: "Big Buck Bunny: Open Source Animation Legacy",
      description:
        "Celebrating the impact of open-source animation. Big Buck Bunny has become a symbol of creative freedom and collaborative storytelling in the animation community.",
      image: "/bigbuck/image/Big_Buck_Bunny_loves_Creative_Commons.png",
    },
  ];

  return (
    <section ref={sectionRef} className={styles.fifthSection}>
      <div className={styles.fifthSectionContent}>
        <div
          className={styles.fifthSectionHeader}
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleTransform}px)`,
          }}
        >
          <h2 className={styles.fifthSectionTitle}>Stay up to date</h2>
        </div>
        <div className={styles.fifthSectionGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.fifthSectionTile}>
              <div className={styles.fifthSectionImageWrapper}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.fifthSectionImage}
                />
              </div>
              <div className={styles.fifthSectionTileContent}>
                <h3 className={styles.fifthSectionTileTitle}>
                  {project.title}
                </h3>
                <p className={styles.fifthSectionTileDescription}>
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
