import { useState, useRef, useEffect } from "react";
import { Particle } from "./Particle";

export const FeatureSection = ({ 
  title, 
  description, 
  icon: Icon, 
  image, 
  reverse = false,
  bgColor = 'bg-white'
}: {
  title: string;
  description: string;
  icon: any;
  image: React.ReactNode;
  reverse?: boolean;
  bgColor?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
  return (
    <div className={`relative ${bgColor} py-20 overflow-hidden`}>
      {bgColor !== 'bg-white' && (
        <>
          {[...Array(15)].map((_, i) => (
            <Particle key={i} delay={i} />
          ))}
        </>
        // <ParticlesBackground />
      )}
      
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                {image}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
