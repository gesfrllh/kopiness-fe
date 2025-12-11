"use client";
import { useRef, useEffect } from "react";

type Direction = "left" | "right";

export function useInfiniteSlider<T extends HTMLElement>({
  speed = 0.3,
  direction = "left",
}) {
  const containerRef = useRef<T | null>(null);
  const isHovering = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    const slider = containerRef.current;
    if (!slider) return;

    const totalScroll = slider.scrollWidth / 2;

    let frame: number;

    const animate = () => {
      if (!isDragging.current && !isHovering.current) {
        slider.scrollLeft += direction === "left" ? speed : -speed;

        if (direction === "left" && slider.scrollLeft >= totalScroll) {
          slider.scrollLeft = 0;
        }

        if (direction === "right" && slider.scrollLeft <= 0) {
          slider.scrollLeft = totalScroll;
        }
      }
      frame = requestAnimationFrame(animate);
    };

    animate();

    const onEnter = () => (isHovering.current = true);
    const onLeave = () => (isHovering.current = false);

    const onDragStart = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX;
      scrollStart.current = slider.scrollLeft;
    };

    const onDragMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const diff = e.pageX - startX.current;
      slider.scrollLeft = scrollStart.current - diff;
    };

    const onDragEnd = () => {
      isDragging.current = false;
    };

    slider.addEventListener("mouseenter", onEnter);
    slider.addEventListener("mouseleave", onLeave);
    slider.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    return () => {
      cancelAnimationFrame(frame);
      slider.removeEventListener("mouseenter", onEnter);
      slider.removeEventListener("mouseleave", onLeave);
      slider.removeEventListener("mousedown", onDragStart);
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, [speed, direction]);

  return containerRef;
}
