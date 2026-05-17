"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // --- 1. SCÈNE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // --- 2. BOL CREATIE ---
    const imageCount = 50;
    const radius = 3;

    for (let i = 0; i < imageCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / imageCount);
      const theta = Math.sqrt(imageCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const geometry = new THREE.PlaneGeometry(0.5, 0.7);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xcccccc, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });

      const photo = new THREE.Mesh(geometry, material);
      photo.position.set(x, y, z);
      photo.lookAt(0, 0, 0);
      sphereGroup.add(photo);
    }

    // --- 3. INTERACTIE LOGICA ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleDown = (x: number, y: number) => {
      isDragging = true;
      previousMousePosition = { x, y };
    };

    const handleMove = (x: number, y: number) => {
      if (!isDragging) return;
      const deltaMove = { x: x - previousMousePosition.x, y: y - previousMousePosition.y };
      
      sphereGroup.rotation.y += deltaMove.x * 0.005;
      sphereGroup.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x, y };
    };

    const onMouseDown = (e: MouseEvent) => handleDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => handleDown(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);

    // --- 4. ANIMATIE ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (!isDragging) {
        sphereGroup.rotation.y += 0.002;
      }

      sphereGroup.children.forEach((obj) => {
        const mesh = obj as THREE.Mesh;
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        const distance = camera.position.distanceTo(worldPos);
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.opacity = Math.max(0.1, 1.2 - (distance / 7));
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 5. CLEANUP ---
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', background: '#fff', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
    </main>
  );
}