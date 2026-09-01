import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Brain, 
  Ruler, 
  AlertTriangle, 
  Video, 
  Dumbbell, 
  Utensils, 
  Bot, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Mic
} from 'lucide-react';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const [activeFlowNode, setActiveFlowNode] = useState(0);

  // Three.js 3D Athletic Skeletal Body Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(480, 520);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const tealLight = new THREE.PointLight(0x061E1A, 3, 10);
    tealLight.position.set(2, 3, 2);
    scene.add(tealLight);

    const limeLight = new THREE.PointLight(0xB8FF4D, 2.5, 10);
    limeLight.position.set(-2, 1, 2);
    scene.add(limeLight);

    const purpleLight = new THREE.PointLight(0x5B3A8E, 2, 10);
    purpleLight.position.set(0, -2, 1);
    scene.add(purpleLight);

    // Anatomical Skeletal Model representation
    const bodyGroup = new THREE.Group();

    // Joint landmark positions (Head, Shoulders, Elbows, Wrists, Hips, Knees, Ankles)
    const landmarks = {
      head: new THREE.Vector3(0, 1.45, 0),
      neck: new THREE.Vector3(0, 1.2, 0),
      shoulderL: new THREE.Vector3(-0.35, 1.15, 0),
      shoulderR: new THREE.Vector3(0.35, 1.15, 0),
      elbowL: new THREE.Vector3(-0.48, 0.75, 0.1),
      elbowR: new THREE.Vector3(0.48, 0.75, 0.1),
      wristL: new THREE.Vector3(-0.4, 0.35, 0.2),
      wristR: new THREE.Vector3(0.4, 0.35, 0.2),
      hipL: new THREE.Vector3(-0.2, 0.35, 0),
      hipR: new THREE.Vector3(0.2, 0.35, 0),
      kneeL: new THREE.Vector3(-0.22, -0.25, 0.15),
      kneeR: new THREE.Vector3(0.22, -0.25, 0.15),
      ankleL: new THREE.Vector3(-0.2, -0.85, 0),
      ankleR: new THREE.Vector3(0.2, -0.85, 0)
    };

    // Create Glowing AI Joint Spheres
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0xB8FF4D,
      emissive: 0xB8FF4D,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });

    const jointSpheres = [];
    Object.keys(landmarks).forEach(key => {
      const geo = new THREE.SphereGeometry(0.045, 16, 16);
      const mesh = new THREE.Mesh(geo, jointMaterial);
      mesh.position.copy(landmarks[key]);
      bodyGroup.add(mesh);
      jointSpheres.push(mesh);
    });

    // Create Skeletal Connections
    const connections = [
      ['head', 'neck'],
      ['neck', 'shoulderL'], ['neck', 'shoulderR'],
      ['shoulderL', 'elbowL'], ['elbowL', 'wristL'],
      ['shoulderR', 'elbowR'], ['elbowR', 'wristR'],
      ['shoulderL', 'hipL'], ['shoulderR', 'hipR'],
      ['hipL', 'hipR'],
      ['hipL', 'kneeL'], ['kneeL', 'ankleL'],
      ['hipR', 'kneeR'], ['kneeR', 'ankleR']
    ];

    const lineMat = new THREE.LineBasicMaterial({ color: 0x5B3A8E, linewidth: 3 });
    const lines = [];

    connections.forEach(([startKey, endKey]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([landmarks[startKey], landmarks[endKey]]);
      const line = new THREE.Line(geo, lineMat);
      bodyGroup.add(line);
      lines.push({ line, startKey, endKey });
    });

    // Add Scanning Laser Plane
    const scanGeo = new THREE.PlaneGeometry(1.6, 0.02);
    const scanMat = new THREE.MeshBasicMaterial({ color: 0xB8FF4D, side: THREE.DoubleSide });
    const scanMesh = new THREE.Mesh(scanGeo, scanMat);
    bodyGroup.add(scanMesh);

    scene.add(bodyGroup);

    // Animation Loop (Slow controlled athletic squat movement)
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Squat vertical offset calculation
      const squatFactor = Math.sin(time * 1.5) * 0.5 + 0.5; // 0 to 1
      const dropY = squatFactor * 0.35;

      // Update Hips and lower body joints
      landmarks.hipL.y = 0.35 - dropY;
      landmarks.hipR.y = 0.35 - dropY;
      landmarks.kneeL.z = 0.15 + squatFactor * 0.15;
      landmarks.kneeR.z = 0.15 + squatFactor * 0.15;
      landmarks.kneeL.y = -0.25 - dropY * 0.5;
      landmarks.kneeR.y = -0.25 - dropY * 0.5;
      landmarks.shoulderL.y = 1.15 - dropY;
      landmarks.shoulderR.y = 1.15 - dropY;
      landmarks.neck.y = 1.2 - dropY;
      landmarks.head.y = 1.45 - dropY;

      // Update positions of spheres
      let i = 0;
      Object.keys(landmarks).forEach(key => {
        if (jointSpheres[i]) jointSpheres[i].position.copy(landmarks[key]);
        i++;
      });

      // Update lines
      lines.forEach(({ line, startKey, endKey }) => {
        const positions = line.geometry.attributes.position.array;
        positions[0] = landmarks[startKey].x;
        positions[1] = landmarks[startKey].y;
        positions[2] = landmarks[startKey].z;
        positions[3] = landmarks[endKey].x;
        positions[4] = landmarks[endKey].y;
        positions[5] = landmarks[endKey].z;
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Laser scan movement
      scanMesh.position.y = Math.sin(time * 2.5) * 1.0 + 0.3;

      // Subtle body rotation
      bodyGroup.rotation.y = Math.sin(time * 0.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Flow timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFlowNode(prev => (prev + 1) % 9);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const flowNodes = [
    { icon: Camera, label: 'CAMERA', sub: 'Input Video Feed' },
    { icon: Brain, label: 'AI SEES', sub: 'MediaPipe Engine' },
    { icon: Ruler, label: 'POSTURE ANALYSIS', sub: '33 Joint Kinematics' },
    { icon: AlertTriangle, label: 'ERROR DETECTED', sub: 'Knee Valgus Alert' },
    { icon: Video, label: 'CORRECTION', sub: 'Biomechanical Fix' },
    { icon: Dumbbell, label: 'WORKOUT COACH', sub: 'Rep & Form Score' },
    { icon: Utensils, label: 'NUTRITION', sub: 'Precision Macro Target' },
    { icon: Bot, label: 'FITBOT', sub: 'Context-Aware AI' },
    { icon: BarChart3, label: 'PROGRESS', sub: 'Adaptive Plan Update' }
  ];

  return (
    <div className="min-h-screen aurora-bg cyber-grid text-ivory">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-[85vh]">
        
        {/* Left Column: Headings & CTA */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bioteal-dark border border-lime-accent/40 shadow-glow-lime/20"
          >
            <Zap className="w-4 h-4 text-lime-accent" />
            <span className="text-xs font-mono text-lime-accent tracking-wide uppercase">Next-Gen Bio-Feedback Architecture</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none"
          >
            FITVISION <span className="text-lime-glow">AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl font-semibold text-lime-accent"
          >
            Your AI-powered fitness, nutrition and real-time voice coach.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-ivory/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            See your movement. Correct your form. Understand your nutrition. Track your progress.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
          >
            <Link
              to="/profile/setup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-lime-accent text-obsidian font-bold text-base hover:bg-lime-hover shadow-glow-lime transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Start Your Fitness Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/voice-coach"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel-purple text-ivory font-semibold text-base border border-ultraviolet-mist hover:bg-ultraviolet-mist/40 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Mic className="w-5 h-5 text-lime-accent" />
              <span>Explore AI Coach</span>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: 3D Athletic Hero & Floating Telemetry Panels */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center mt-12 lg:mt-0">
          
          {/* Background Aura Glow */}
          <div className="absolute w-[420px] h-[420px] bg-bioteal-dark/80 rounded-full blur-3xl -z-10 animate-pulse-slow" />
          
          {/* 3D Canvas */}
          <canvas ref={canvasRef} className="w-[360px] h-[400px] sm:w-[480px] sm:h-[520px] z-10" />

          {/* Floating Telemetry Panel 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-4 left-0 sm:left-4 glass-panel p-4 rounded-2xl border border-lime-accent/30 shadow-glow-lime/20 z-20 space-y-1 w-44"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-lime-accent font-bold">
              <span>AI ACTIVE</span>
              <span className="w-2 h-2 rounded-full bg-lime-accent animate-ping" />
            </div>
            <div className="text-xs text-ivory/60 font-mono uppercase">EXERCISE</div>
            <div className="text-sm font-black text-ivory tracking-wide">SQUAT</div>
            <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-lime-accent/10">
              <span className="text-ivory/60">REP</span>
              <span className="text-lime-accent font-bold">08 / 12</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-ivory/60">FORM</span>
              <span className="text-lime-accent font-bold">87%</span>
            </div>
            <div className="text-[10px] font-bold text-center bg-lime-accent/10 text-lime-accent py-0.5 rounded border border-lime-accent/30 mt-1">
              GOOD FORM
            </div>
          </motion.div>

          {/* Floating Telemetry Panel 2 (AI Speech Quote) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute bottom-6 right-0 sm:right-4 glass-panel-purple p-4 rounded-2xl border border-ultraviolet-mist/50 shadow-glow-purple z-20 space-y-1 w-52"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-lime-accent">
              <Mic className="w-4 h-4 animate-pulse" />
              <span>AI VOICE COACH</span>
            </div>
            <p className="text-xs text-ivory font-medium italic pt-1">
              "Keep your knees aligned over mid-toes."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ANIMATED HERO FLOW SECTION */}
      <section className="py-16 bg-bioteal-dark/30 border-y border-lime-accent/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-xs font-mono text-lime-accent uppercase tracking-widest">Autonomous Vision Architecture</h2>
            <p className="text-2xl sm:text-3xl font-bold text-ivory">Sequential AI Processing Pipeline</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
            {flowNodes.map((node, index) => {
              const Icon = node.icon;
              const active = activeFlowNode === index;
              return (
                <div
                  key={node.label}
                  className={`p-3 rounded-xl transition-all duration-500 flex flex-col items-center text-center space-y-2 relative ${
                    active
                      ? 'bg-bioteal-dark border-2 border-lime-accent shadow-glow-lime scale-105 z-10'
                      : 'glass-panel border-lime-accent/10 opacity-70'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${active ? 'bg-lime-accent text-obsidian' : 'bg-obsidian text-lime-accent'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-extrabold tracking-tight text-ivory">{node.label}</div>
                  <div className="text-[9px] font-mono text-ivory/60">{node.sub}</div>
                  
                  {index < flowNodes.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-lime-accent/40 font-bold z-20">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SHOWCASE SECTIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        
        {/* Feature 1: AI Workout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30">
              <Dumbbell className="w-4 h-4" />
              <span>MODULE 01</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ivory">AI Workout & Real-Time Tracking</h2>
            <p className="text-ivory/70 text-base leading-relaxed">
              Select target compound movements (Squat, Push-up, Lunges, Plank, Jumping Jacks). Live browser computer vision tracks joint angles locally without uploading raw video.
            </p>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-lime-accent" /> <span>33-point MediaPipe Pose Landmarker</span></li>
              <li className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-lime-accent" /> <span>Automatic rep counting & eccentric/concentric phase tracking</span></li>
            </ul>
            <Link to="/workout" className="inline-flex items-center space-x-2 text-lime-accent font-semibold hover:underline">
              <span>View Exercise Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-lime-accent/20 shadow-glow-teal">
            <div className="bg-obsidian/80 rounded-2xl p-6 border border-lime-accent/15 space-y-4">
              <div className="flex justify-between items-center text-sm font-mono text-lime-accent border-b border-lime-accent/10 pb-2">
                <span>CANVAS POSE HUD</span>
                <span className="text-xs bg-lime-accent/10 px-2 py-0.5 rounded">60 FPS</span>
              </div>
              <div className="h-44 bg-bioteal-dark/60 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-scanline opacity-20" />
                <div className="text-center space-y-2">
                  <Camera className="w-8 h-8 text-lime-accent mx-auto animate-pulse" />
                  <div className="text-xs font-mono text-ivory/70">MEDIA PIPE POSE ACTIVE</div>
                  <div className="text-sm font-bold text-lime-accent">KNEE ANGLE: 88° (OPTIMAL PARALLEL)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Smart Posture Correction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 glass-panel p-6 rounded-3xl border border-ultraviolet-mist/40 shadow-glow-purple">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-obsidian/80 p-4 rounded-xl border border-red-500/30 text-center space-y-2">
                <div className="text-xs font-mono text-red-400 font-bold">❌ INCORRECT FORM</div>
                <div className="text-xs text-ivory/70">Knees caving inward (Valgus)</div>
              </div>
              <div className="bg-obsidian/80 p-4 rounded-xl border border-lime-accent/30 text-center space-y-2">
                <div className="text-xs font-mono text-lime-accent font-bold">✅ CORRECT FORM</div>
                <div className="text-xs text-ivory/70">Knees aligned over mid-toes</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30">
              <AlertTriangle className="w-4 h-4 text-lime-accent" />
              <span>MODULE 02</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ivory">Smart Posture Correction</h2>
            <p className="text-ivory/70 text-base leading-relaxed">
              When form errors occur, FITVISION AI isolates the exact biomechanical breakdown and routes to an instructional correction breakdown with visual guide videos.
            </p>
            <Link to="/workout/correction" className="inline-flex items-center space-x-2 text-lime-accent font-semibold hover:underline">
              <span>See Posture Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature 3: AI Nutrition & Grocery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30">
              <Utensils className="w-4 h-4" />
              <span>MODULE 03 & 04</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ivory">Deterministic AI Nutrition & Budget Grocery</h2>
            <p className="text-ivory/70 text-base leading-relaxed">
              No hallucinated calories. Macro calculations stem directly from verified USDA values. Seamlessly swap foods (e.g. Rice to Sweet Potato) or optimize your 7-day grocery list within your custom weekly budget.
            </p>
            <div className="flex space-x-4">
              <Link to="/nutrition" className="text-sm font-bold text-lime-accent hover:underline">Nutrition Hub →</Link>
              <Link to="/grocery/budget" className="text-sm font-bold text-lime-accent hover:underline">Grocery Budgeting →</Link>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-lime-accent/20 shadow-glow-teal">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian/70 border border-lime-accent/10">
                <span className="text-sm font-bold text-ivory">Cooked Rice (200g)</span>
                <span className="text-xs font-mono text-lime-accent">260 kcal | 5.4g Protein</span>
              </div>
              <div className="text-center text-xs font-mono text-lime-accent/60">↓ SMART FOOD REPLACEMENT ↓</div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-bioteal-dark border border-lime-accent/40">
                <span className="text-sm font-bold text-lime-accent">Roasted Sweet Potato (220g)</span>
                <span className="text-xs font-mono text-lime-accent">189 kcal | 3.5g Protein</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-lime-accent/15 py-8 text-center text-xs text-ivory/50 font-mono">
        <p>FITVISION AI © 2026 — Next-Gen AI Fitness, Nutrition & Real-Time Voice Platform.</p>
      </footer>
    </div>
  );
}
