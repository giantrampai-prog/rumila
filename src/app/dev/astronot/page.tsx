"use client";

// Pratinjau KHUSUS DEVELOPMENT model 3D astronaut Agam (GLB dari Higgsfield). Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function DevAstronot() {
  if (process.env.NODE_ENV !== "development") notFound();
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    r.setSize(el.clientWidth, el.clientHeight);
    r.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(r.domElement);
    const s = new THREE.Scene();
    s.background = new THREE.Color(0x1d2a44);
    const cam = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.05, 50);
    cam.position.set(0.6, 1.0, 2.6);
    const ctl = new OrbitControls(cam, r.domElement);
    ctl.target.set(0, 0.6, 0);
    s.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.4));
    const d = new THREE.DirectionalLight(0xffffff, 2.2);
    d.position.set(2, 3, 2);
    s.add(d);
    new GLTFLoader().load("/roket/agam-astronot.glb", (g) => {
      s.add(g.scene);
      (window as unknown as Record<string, unknown>).__astro = g.scene;
    });
    (window as unknown as Record<string, unknown>).__shot = (yaw: number) => {
      cam.position.set(Math.sin(yaw) * 2.6, 1.0, Math.cos(yaw) * 2.6);
      cam.lookAt(0, 0.6, 0);
      r.render(s, cam);
      return r.domElement.toDataURL("image/jpeg", 0.8);
    };
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctl.update();
      r.render(s, cam);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      r.dispose();
      el.innerHTML = "";
    };
  }, []);
  return <div ref={host} style={{ position: "fixed", inset: 0 }} />;
}
