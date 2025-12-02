"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import HeroSection from "./HeroSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";
import FifthSection from "./FifthSection";
import FooterSection from "./FooterSection";
import MenuModal from "./MenuModal";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blokuj scroll gdy menu jest otwarte
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerLogoCircle}>CG</div>
          <div
            className={`${styles.headerTagline} ${
              isScrolled ? styles.headerTaglineHidden : ""
            }`}
          >
            <span>OPEN SOURCE ANIMATION</span>
            <span>// CHARACTER STORYTELLING</span>
          </div>
        </div>
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </header>

      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className={styles.main}>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="what-we-do">
          <SecondSection />
        </section>
        <section id="projects">
          <ThirdSection />
        </section>
        <section id="make-things-happen">
          <FourthSection />
        </section>
        <section id="up-to-date">
          <FifthSection />
        </section>
        <section id="get-in-touch">
          <FooterSection />
        </section>
      </main>
    </div>
  );
}
