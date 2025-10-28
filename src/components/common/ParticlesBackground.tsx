// components/ParticlesBackground.tsx
import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
}

const ParticlesBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = document.documentElement.scrollWidth;
            canvas.height = document.documentElement.scrollHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        const particles: Particle[] = [];
        const particleCount = 30;
        const colors = [
            'rgba(59, 130, 246, 0.3)', // blue-500
            'rgba(139, 92, 246, 0.3)', // purple-500
            'rgba(99, 102, 241, 0.3)', // indigo-500
        ];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Bounce off edges
                if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
                if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Draw connections
                particles.forEach((particle2, index2) => {
                    if (index !== index2) {
                        const dx = particle.x - particle2.x;
                        const dy = particle.y - particle2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 150) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(particle2.x, particle2.y);
                            ctx.stroke();
                        }
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default ParticlesBackground;