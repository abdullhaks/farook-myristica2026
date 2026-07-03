import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

// Helper to programmatically generate a soft radial-gradient glow texture
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

interface ParticleGroupProps {
  count: number;
  size: number;
  opacity: number;
  speedMultiplier: number;
  minZ: number;
  maxZ: number;
  repulsionStrength: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

const Particles = ({
  count,
  size,
  opacity,
  speedMultiplier,
  minZ,
  maxZ,
  repulsionStrength,
  mouseRef,
}: ParticleGroupProps) => {
  const mesh = useRef<THREE.Points>(null);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // Initialize positions and vertex colors
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    // Premium botanical color palette
    const colorPalette = [
      new THREE.Color('#4CAF75'), // Emerald Green
      new THREE.Color('#A8C4A0'), // Soft Mint
      new THREE.Color('#C8A850'), // Warm Botanical Gold
      new THREE.Color('#2D7A4F'), // Deep Forest Green
    ];

    for (let i = 0; i < count; i++) {
      // Randomly distribute in space (we will scale based on viewport in useFrame)
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = minZ + Math.random() * (maxZ - minZ);

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [count, minZ, maxZ]);

  // Per-particle movement behavior
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        sineOffset: Math.random() * Math.PI * 2,
        sineSpeed: 0.3 + Math.random() * 0.7,
        speedY: (0.15 + Math.random() * 0.25) * speedMultiplier,
        speedX: (Math.random() - 0.5) * 0.05 * speedMultiplier,
      });
    }
    return data;
  }, [count, speedMultiplier]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Cap delta to prevent huge jumps on frame drops
    const d = Math.min(delta, 0.1);
    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    // Mouse coordinates projected at z=0 (using the ref)
    let mx = -999;
    let my = -999;
    if (mouseRef.current && mouseRef.current.x !== -999) {
      mx = (mouseRef.current.x * state.viewport.width) / 2;
      my = (mouseRef.current.y * state.viewport.height) / 2;
    }

    const halfHeight = state.viewport.height / 2 + 1.5;
    const halfWidth = state.viewport.width / 2 + 1.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const pData = particleData[i];

      // 1. Upward drift
      pos[idx + 1] += pData.speedY * d;

      // 2. Gentle horizontal waving drift
      pos[idx] += (pData.speedX + Math.sin(time * pData.sineSpeed + pData.sineOffset) * 0.04) * d;

      // 3. Mouse Interaction (Repulsion)
      if (mx !== -999) {
        const dx = pos[idx] - mx;
        const dy = pos[idx + 1] - my;
        const distSq = dx * dx + dy * dy;
        const influenceRadius = 2.0;
        const influenceRadiusSq = influenceRadius * influenceRadius;

        if (distSq < influenceRadiusSq) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.01) {
            const force = (influenceRadius - dist) / influenceRadius;
            // Apply repulsion force away from cursor
            pos[idx] += (dx / dist) * force * repulsionStrength * d;
            pos[idx + 1] += (dy / dist) * force * repulsionStrength * d;
          }
        }
      }

      // 4. Boundary wrapping
      if (pos[idx + 1] > halfHeight) {
        pos[idx + 1] = -halfHeight;
        pos[idx] = (Math.random() - 0.5) * state.viewport.width;
      }

      if (pos[idx] > halfWidth) {
        pos[idx] = -halfWidth;
      } else if (pos[idx] < -halfWidth) {
        pos[idx] = halfWidth;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;

    // Slow orbital rotation for deep 3D parallax
    mesh.current.rotation.y = time * 0.005;
    mesh.current.rotation.x = time * 0.002;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={glowTexture}
      />
    </points>
  );
};

export default function ParticleField() {
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert to normalized device coordinates (-1 to 1)
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -999;
      mouseRef.current.y = -999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent', position: 'absolute', inset: 0 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Background Layer: Many small, glowing, distant particles */}
        <Particles
          count={1000}
          size={0.06}
          opacity={0.4}
          speedMultiplier={1.0}
          minZ={-4}
          maxZ={1}
          repulsionStrength={1.2}
          mouseRef={mouseRef}
        />

        {/* Midground Layer: Medium sized particles */}
        <Particles
          count={400}
          size={0.12}
          opacity={0.3}
          speedMultiplier={1.4}
          minZ={1}
          maxZ={2.5}
          repulsionStrength={2.0}
          mouseRef={mouseRef}
        />

        {/* Foreground Layer: Fewer, very large, blurry, close-up botanical spores */}
        <Particles
          count={25}
          size={0.4}
          opacity={0.15}
          speedMultiplier={1.8}
          minZ={3}
          maxZ={4.5}
          repulsionStrength={3.5}
          mouseRef={mouseRef}
        />
      </Canvas>
    </div>
  );
}
