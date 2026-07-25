"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import testimonial1 from "../../../assets/images/dep-1.webp";
import testimonial2 from "../../../assets/images/dep-2.webp";
import testimonial3 from "../../../assets/images/dep-3.webp";
import testimonial4 from "../../../assets/images/dep-4.webp";
import testimonial5 from "../../../assets/images/dep-5.webp";
import testimonial6 from "../../../assets/images/dep-6.webp";
import testimonial7 from "../../../assets/images/dep-7.webp";
import testimonial8 from "../../../assets/images/dep-8.webp";
import styles from "@/app/(storefront)/storefront.module.css";

const TESTIMONIALS = [
  testimonial1,
  testimonial2,
  testimonial3,
  testimonial4,
  testimonial5,
  testimonial6,
  testimonial7,
  testimonial8,
];

export function BirthdayTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 3500);
    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, paused]);

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartX.current = event.clientX;
    setPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event) {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    if (Math.abs(distance) >= 45) {
      setActiveIndex((current) => (current + (distance < 0 ? 1 : -1) + TESTIMONIALS.length) % TESTIMONIALS.length);
    }
    pointerStartX.current = null;
    setPaused(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function cancelPointerInteraction() {
    pointerStartX.current = null;
    setPaused(false);
  }

  return <div
    className={styles.testimonialSlider}
    aria-label="Registros de aniversariantes da Pizza Express"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={(event) => !event.currentTarget.contains(event.relatedTarget) && setPaused(false)}
  >
    <figure
      className={styles.testimonialViewport}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={cancelPointerInteraction}
      onDragStart={(event) => event.preventDefault()}
    >
      <Image
        key={activeIndex}
        className={styles.testimonialImage}
        src={TESTIMONIALS[activeIndex]}
        alt={`Aniversariante participante da promoção Pizza Express | registro ${activeIndex + 1} de ${TESTIMONIALS.length}`}
        fill
        draggable="false"
        sizes="(max-width: 780px) calc(100vw - 2rem), 430px"
      />
    </figure>
    <div className={styles.testimonialDots} aria-label="Selecionar depoimento">
      {TESTIMONIALS.map((_, index) => <button
        className={index === activeIndex ? styles.testimonialDotActive : styles.testimonialDot}
        type="button"
        key={index}
        onClick={() => setActiveIndex(index)}
        aria-label={`Mostrar depoimento ${index + 1}`}
        aria-current={index === activeIndex ? "true" : undefined}
      />)}
    </div>
  </div>;
}
