import { useEffect, useRef } from "react";

export function DustMotes({ count = 50 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const motes = [];
    
    for (let i = 0; i < count; i++) {
      const mote = document.createElement("div");
      mote.className = "dust-mote";
      
      const size = Math.random() * 3 + 1;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 10;
      const opacity = Math.random() * 0.4 + 0.1;
      
      mote.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(201, 169, 97, ${opacity}) 0%, transparent 70%);
        border-radius: 50%;
        left: ${startX}%;
        top: ${startY}%;
        pointer-events: none;
        animation: float-dust ${duration}s ease-in-out ${delay}s infinite;
      `;
      
      container.appendChild(mote);
      motes.push(mote);
    }

    return () => {
      motes.forEach(mote => mote.remove());
    };
  }, [count]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 overflow-hidden pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
