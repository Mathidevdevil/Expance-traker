import React, { useEffect, useRef } from 'react';

const PixelBlast = ({
    variant = 'square',
    pixelSize = 3,
    color = '#B19EEF',
    patternScale = 2,
    patternDensity = 1,
    enableRipples = true,
    rippleSpeed = 0.3,
    rippleThickness = 0.1,
    rippleIntensityScale = 1,
    speed = 0.5,
    transparent = true,
    edgeFade = 0.5,
    className = '',
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement.clientWidth || 1080;
        let height = canvas.height = canvas.parentElement.clientHeight || 1080;

        let particles = [];
        let ripples = [];
        let animationFrameId;

        // Convert hex color to rgba for transparency support
        const hexToRgba = (hex, alpha = 1) => {
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // Initialize particles based on density and scale
        const initParticles = () => {
            particles = [];
            const numParticles = Math.floor((width * height) / (1000 * patternScale)) * patternDensity;

            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    size: pixelSize * (Math.random() * 0.5 + 0.5),
                    baseAlpha: Math.random() * 0.6 + 0.1,
                });
            }
        };

        // Calculate edge fade (opacity decreases near edges based on edgeFade parameter)
        const getEdgeOpacity = (x, y) => {
            if (edgeFade <= 0) return 1;
            const distX = Math.min(x, width - x) / width;
            const distY = Math.min(y, height - y) / height;
            const minDist = Math.min(distX, distY);

            return Math.min(1, minDist / (edgeFade / 2));
        };

        // Draw frame
        const render = () => {
            if (transparent) {
                ctx.clearRect(0, 0, width, height);
            } else {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
            }

            // Process ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i];
                ripple.radius += rippleSpeed * 10;
                ripple.life -= 0.01;

                if (ripple.life <= 0) {
                    ripples.splice(i, 1);
                }
            }

            // Process and draw particles
            particles.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Calculate ripple displacement
                let displacementX = 0;
                let displacementY = 0;
                let brightnessBoost = 0;

                if (enableRipples) {
                    ripples.forEach(ripple => {
                        const dx = p.x - ripple.x;
                        const dy = p.y - ripple.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // Check if particle is near the ripple wave
                        const waveWidth = rippleThickness * 100;
                        if (Math.abs(dist - ripple.radius) < waveWidth) {
                            const impact = 1 - Math.abs(dist - ripple.radius) / waveWidth;
                            const force = impact * ripple.life * rippleIntensityScale;

                            if (dist > 0) {
                                displacementX += (dx / dist) * force * 5;
                                displacementY += (dy / dist) * force * 5;
                                brightnessBoost += force * 0.5;
                            }
                        }
                    });
                }

                const drawX = p.x + displacementX;
                const drawY = p.y + displacementY;

                // Draw particle
                const edgeAlpha = getEdgeOpacity(drawX, drawY);
                const finalAlpha = Math.min(1, (p.baseAlpha + brightnessBoost) * edgeAlpha);

                ctx.fillStyle = hexToRgba(color, finalAlpha);

                if (variant === 'square') {
                    ctx.fillRect(drawX - p.size / 2, drawY - p.size / 2, p.size, p.size);
                } else if (variant === 'circle') {
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Default to square if unknown
                    ctx.fillRect(drawX - p.size / 2, drawY - p.size / 2, p.size, p.size);
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // Handle resize
        const handleResize = () => {
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
            initParticles();
        };

        // Handle clicks for ripples
        const handleClick = (e) => {
            if (!enableRipples) return;

            const rect = canvas.getBoundingClientRect();
            ripples.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                life: 1,
            });
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('click', handleClick);

        initParticles();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, [variant, pixelSize, color, patternScale, patternDensity, enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale, speed, transparent, edgeFade]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
            style={{ display: 'block' }}
        />
    );
};

export default PixelBlast;
