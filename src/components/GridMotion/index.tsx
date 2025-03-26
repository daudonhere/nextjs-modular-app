import React, { useEffect, useRef, FC } from "react";
import { gsap } from "gsap";
import "./style.css";

interface GridMotionProps {
  items?: string[];
  gradientColor?: string;
}

const GridMotion: FC<GridMotionProps> = ({ items = [], gradientColor = "black" }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef<number>(0); // Gunakan useRef agar tidak menyebabkan re-render

  useEffect(() => {
    if (typeof window === "undefined") return; // Hindari error di SSR
    mouseXRef.current = window.innerWidth / 2; // Set nilai awal mouseX

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX; // Update ref tanpa menyebabkan re-render
    };

    const updateMotion = () => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) *
            direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });

      requestAnimationFrame(updateMotion); // Jalankan animasi secara terus-menerus
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(updateMotion); // Mulai animasi

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="noscroll loading" ref={gridRef}>
      <section
        className="intro"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="gridMotion-container">
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="row"
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
                return undefined;
              }}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = items[rowIndex * 7 + itemIndex] ?? `Item ${rowIndex * 7 + itemIndex + 1}`;
                return (
                  <div key={itemIndex} className="row__item">
                    <div className="row__item-inner" style={{ backgroundColor: "#111" }}>
                      {typeof content === "string" && content.startsWith("http") ? (
                        <div
                          className="row__item-img"
                          style={{ backgroundImage: `url(${content})` }}
                        ></div>
                      ) : (
                        <div className="row__item-content">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="fullview"></div>
      </section>
    </div>
  );
};

export default GridMotion;
