import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVoice } from '../context/VoiceContext';
import { api } from '../services/api';
import { 
  Camera, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function WorkoutLivePage() {
  const [searchParams] = useSearchParams();
  const exerciseName = searchParams.get('exercise') || 'squat';
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { speak } = useVoice();

  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Real-time exercise telemetry state
  const [reps, setReps] = useState(0);
  const [targetReps] = useState(12);
  const [formScore, setFormScore] = useState(92);
  const [formStatus, setFormStatus] = useState('GOOD FORM');
  const [kneeAngle, setKneeAngle] = useState(170);
  const [hipAngle, setHipAngle] = useState(165);
  const [lastIssue, setLastIssue] = useState(null);

  const squatPhaseRef = useRef('up'); // 'up' or 'down'

  // Initialize Camera Stream
  useEffect(() => {
    let stream = null;

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Camera API (getUserMedia) is not supported in this browser environment.');
        return;
      }

      try {
        // First try standard video constraint
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(e => console.warn('Video play error:', e));
            setCameraActive(true);
            setPermissionError(null);
            if (voiceEnabled) speak(`Starting ${exerciseName} workout. Camera tracking online.`);
          };
        }
      } catch (err) {
        console.error('Camera access denied or error:', err);
        setPermissionError('Camera access requested. Please click Allow in your browser popup, or click "Start Simulated Camera" below.');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [exerciseName]);

  // Real-Time Canvas Skeleton & Biomechanical Logic Loop
  useEffect(() => {
    if (!cameraActive) return;

    let animId;
    let frameCount = 0;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      frameCount++;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simulate MediaPipe Joint Coordinates on Video Feed
      const time = frameCount * 0.05;
      const squatVal = Math.sin(time) * 0.5 + 0.5; // 0 to 1

      // Joint angles
      const currentKnee = Math.round(175 - squatVal * 85); // 175° (standing) to 90° (squat parallel)
      const currentHip = Math.round(170 - squatVal * 75);

      setKneeAngle(currentKnee);
      setHipAngle(currentHip);

      // Rep Counting logic state transitions
      if (currentKnee < 95 && squatPhaseRef.current === 'up') {
        squatPhaseRef.current = 'down';
      } else if (currentKnee > 160 && squatPhaseRef.current === 'down') {
        squatPhaseRef.current = 'up';
        setReps(r => {
          const nextReps = r + 1;
          
          // Random form evaluation on rep complete
          const isError = Math.random() < 0.25; // 25% chance of form issue demo
          let repScore = 95;
          let statusText = 'GOOD FORM';

          if (isError) {
            repScore = 72;
            statusText = 'KNEES INWARD DETECTED';
            setLastIssue('knee_inward');
            if (voiceEnabled) speak('Keep your knees aligned with your toes.');
            
            // Post posture event to backend
            api.savePostureResult({
              exercise: exerciseName,
              rep: nextReps,
              posture: 'incorrect',
              issue: 'knee_inward',
              formScore: 72,
              kneeAngle: currentKnee,
              hipAngle: currentHip
            });
          } else {
            setLastIssue(null);
            if (voiceEnabled) speak(`${nextReps}. Good form.`);
            api.savePostureResult({
              exercise: exerciseName,
              rep: nextReps,
              posture: 'good',
              issue: 'none',
              formScore: 95,
              kneeAngle: currentKnee,
              hipAngle: currentHip
            });
          }

          setFormScore(repScore);
          setFormStatus(statusText);
          return nextReps;
        });
      }

      // Draw Synthetic Skeletal Landmark Overlays
      const width = canvas.width;
      const height = canvas.height;

      // Joints
      const head = { x: width * 0.5, y: height * 0.25 + squatVal * 40 };
      const shoulderL = { x: width * 0.4, y: height * 0.38 + squatVal * 40 };
      const shoulderR = { x: width * 0.6, y: height * 0.38 + squatVal * 40 };
      const hipL = { x: width * 0.43, y: height * 0.6 + squatVal * 40 };
      const hipR = { x: width * 0.57, y: height * 0.6 + squatVal * 40 };
      const kneeL = { x: width * 0.42 - (lastIssue ? 20 : 0), y: height * 0.78 + squatVal * 20 };
      const kneeR = { x: width * 0.58 + (lastIssue ? 20 : 0), y: height * 0.78 + squatVal * 20 };
      const ankleL = { x: width * 0.42, y: height * 0.9 };
      const ankleR = { x: width * 0.58, y: height * 0.9 };

      const joints = [head, shoulderL, shoulderR, hipL, hipR, kneeL, kneeR, ankleL, ankleR];

      // Draw skeleton lines
      ctx.strokeStyle = lastIssue ? '#EF4444' : '#B8FF4D';
      ctx.lineWidth = 4;
      ctx.shadowColor = lastIssue ? 'rgba(239, 68, 68, 0.8)' : 'rgba(184, 255, 77, 0.8)';
      ctx.shadowBlur = 12;

      const bones = [
        [shoulderL, shoulderR],
        [shoulderL, hipL], [shoulderR, hipR],
        [hipL, hipR],
        [hipL, kneeL], [kneeL, ankleL],
        [hipR, kneeR], [kneeR, ankleR]
      ];

      bones.forEach(([p1, p2]) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Joint Circles
      joints.forEach(j => {
        ctx.fillStyle = '#5B3A8E';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#B8FF4D';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw HUD Angle Overlay text on Knee
      ctx.font = 'bold 14px "JetBrains Mono"';
      ctx.fillStyle = '#B8FF4D';
      ctx.fillText(`Knee: ${currentKnee}°`, kneeR.x + 15, kneeR.y);
    };

    renderLoop();

    return () => cancelAnimationFrame(animId);
  }, [cameraActive, exerciseName, voiceEnabled, lastIssue]);

  const finishWorkout = async () => {
    await api.saveWorkout({
      exercise: exerciseName,
      repsCompleted: reps,
      formScore,
      durationSeconds: 180,
      caloriesBurned: 52
    });
    if (voiceEnabled) speak('Workout completed and saved!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory p-4 sm:p-6 flex flex-col space-y-4">
      
      {/* Top Header Controls */}
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate('/workout')}
          className="px-4 py-2 rounded-xl bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono flex items-center space-x-2 hover:bg-bioteal-dark/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Camera</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              voiceEnabled ? 'bg-bioteal-dark border-lime-accent text-lime-accent' : 'bg-obsidian border-ivory/20 text-ivory/50'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={finishWorkout}
            className="px-6 py-2 rounded-xl bg-lime-accent text-obsidian font-extrabold text-xs hover:bg-lime-hover shadow-glow-lime"
          >
            Finish & Save Workout
          </button>
        </div>
      </div>

      {/* Main Camera View Container */}
      <div className="max-w-5xl mx-auto w-full flex-1 relative rounded-3xl overflow-hidden border-2 border-lime-accent/30 bg-bioteal-dark shadow-glow-teal flex items-center justify-center min-h-[450px]">
        
        {permissionError ? (
          <div className="p-8 text-center space-y-4 max-w-md">
            <VideoOff className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-xl font-bold text-ivory">Camera Permission Required</h3>
            <p className="text-xs text-ivory/60">
              {permissionError}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={async () => {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                      videoRef.current.srcObject = stream;
                      videoRef.current.play();
                      setCameraActive(true);
                      setPermissionError(null);
                    }
                  } catch (err) {
                    alert('Camera access blocked. Click "Start AI Simulated Camera" below to test the workout AI.');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-lime-accent text-obsidian font-bold text-xs hover:bg-lime-hover shadow-glow-lime"
              >
                Allow Camera Access
              </button>

              <button
                onClick={() => {
                  setCameraActive(true);
                  setPermissionError(null);
                  if (voiceEnabled) speak(`Starting simulated ${exerciseName} workout. Camera tracking online.`);
                }}
                className="px-6 py-2.5 rounded-xl bg-bioteal-dark border border-lime-accent/40 text-lime-accent font-bold text-xs hover:bg-bioteal-dark/80"
              >
                Start AI Simulated Camera
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* HTML Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover rounded-3xl"
            />
            {/* Canvas HUD Skeleton Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Scanning Beam Visual */}
            <div className="absolute inset-0 bg-scanline opacity-15 pointer-events-none" />

            {/* Top Left HUD Badge */}
            <div className="absolute top-4 left-4 glass-panel p-3.5 rounded-2xl border border-lime-accent/30 space-y-1 z-20">
              <div className="text-[10px] font-mono text-lime-accent font-bold uppercase">{exerciseName} AI TRACKER</div>
              <div className="text-2xl font-black text-ivory">
                REP <span className="text-lime-accent">{reps}</span> / {targetReps}
              </div>
            </div>

            {/* Top Right HUD Form Score Badge */}
            <div className="absolute top-4 right-4 glass-panel p-3.5 rounded-2xl border border-lime-accent/30 text-right space-y-1 z-20">
              <div className="text-[10px] font-mono text-ivory/60 uppercase">FORM ACCURACY</div>
              <div className="text-2xl font-black text-lime-accent">{formScore}%</div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                lastIssue ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-bounce' : 'bg-lime-accent/20 text-lime-accent border-lime-accent/40'
              }`}>
                {formStatus}
              </div>
            </div>

            {/* Bottom Alert Correction Banner */}
            {lastIssue && (
              <div className="absolute bottom-6 inset-x-6 glass-panel-purple p-4 rounded-2xl border border-red-500/60 shadow-glow-purple flex items-center justify-between z-30">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-red-400 uppercase">Posture Warning: Knees moving inward</div>
                    <div className="text-xs text-ivory/80">Drive your knees outward over your mid-toes.</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/workout/correction')}
                  className="px-4 py-2 rounded-xl bg-lime-accent text-obsidian font-extrabold text-xs hover:bg-lime-hover"
                >
                  View Correction Guide
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
