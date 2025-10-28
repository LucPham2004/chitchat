import { useEffect, useState } from "react";

export const Particle = ({ delay }: { delay: number }) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 100 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }, 3000 + delay * 100);
    
    return () => clearInterval(interval);
  }, [delay]);
  
  return (
    <div
      className="absolute w-2 h-2 bg-blue-400/20 rounded-full transition-all duration-3000 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transitionDelay: `${delay * 50}ms`
      }}
    />
  );
};