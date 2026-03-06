import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, '#0b2a33');
  ocean.addColorStop(1, '#062128');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1f6b4a';
  for (let i = 0; i < 28; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const w = 30 + Math.random() * 80;
    const h = 20 + Math.random() * 60;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 150; i += 1) {
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const zoom = Math.min(t / 2.2, 1);
    camera.position.z = 5.2 - zoom * 2.2;
    camera.position.x = Math.sin(t * 0.2) * 0.2;
    camera.position.y = Math.cos(t * 0.18) * 0.15;
    camera.lookAt(target);
  });

  return null;
}

function StarField() {
  const pointsRef = useRef(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i += 1) {
      const radius = 6 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.03} color="#EAFBF3" transparent opacity={0.6} />
    </points>
  );
}

function Globe() {
  const meshRef = useRef(null);
  const glowRef = useRef(null);
  const texture = useMemo(() => createEarthTexture(), []);
  const routes = useMemo(() => {
    const createGeometry = (start, mid, end) => {
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const points = curve.getPoints(64);
      return new THREE.BufferGeometry().setFromPoints(points);
    };
    return [
      createGeometry(
        new THREE.Vector3(-0.9, 0.2, 0.9),
        new THREE.Vector3(-0.2, 0.8, 0.6),
        new THREE.Vector3(0.6, 0.3, 0.7)
      ),
      createGeometry(
        new THREE.Vector3(0.2, -0.6, 1.0),
        new THREE.Vector3(0.8, 0.0, 0.6),
        new THREE.Vector3(-0.4, 0.5, 0.8)
      ),
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.28;
      meshRef.current.rotation.x = 0.2 + Math.sin(t * 0.3) * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.28;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.25, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.05}
          emissive="#0E452C"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.32, 64, 64]} />
        <meshBasicMaterial color="#22A568" transparent opacity={0.12} />
      </mesh>
      {routes.map((geometry, index) => (
        <line key={`route-${index}`} geometry={geometry}>
          <lineBasicMaterial color="#8AE9BD" transparent opacity={0.8} />
        </line>
      ))}
    </>
  );
}

export default function IntroLoader() {
  const [lost, setLost] = useState(false);

  if (lost) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#04150E]">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleLost = (e) => {
            e.preventDefault();
            setLost(true);
          };
          canvas.addEventListener('webglcontextlost', handleLost, false);
        }}
      >
        <ambientLight intensity={0.55} color="#18754A" />
        <directionalLight intensity={1.1} position={[3, 2, 4]} color="#EAFBF3" />
        <pointLight intensity={0.6} position={[-4, -2, -3]} color="#22A568" />
        <StarField />
        <Globe />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="font-body text-xs sm:text-sm tracking-[0.35em] uppercase text-light-green/80"
        >
          Travel Diaries
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.35 }}
          className="font-hero text-3xl sm:text-5xl mt-3"
        >
          Explore the World
        </motion.h1>
      </div>
    </div>
  );
}
