import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { aiApi } from '../services/api';
import { DetectionBox } from '../types';
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Sliders,
  ArrowLeft,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AttendanceCapturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [streamActive, setStreamActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faces, setFaces] = useState<DetectionBox[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [isMock, setIsMock] = useState(true);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Demo enrolled students list
  const enrolledStudents = [
    { id: 's1', studentId: 'STU001', name: 'Alex Johnson', defaultStatus: 'present', confidence: 0.96 },
    { id: 's2', studentId: 'STU002', name: 'Priya Sharma', defaultStatus: 'present', confidence: 0.94 },
    { id: 's3', studentId: 'STU003', name: 'Marcus Vance', defaultStatus: 'present', confidence: 0.91 },
    { id: 's4', studentId: 'STU004', name: 'Elena Rostova', defaultStatus: 'present', confidence: 0.89 },
    { id: 's5', studentId: 'STU005', name: 'David Kim', defaultStatus: 'present', confidence: 0.93 },
    { id: 's6', studentId: 'STU006', name: 'Fatima Zahra', defaultStatus: 'late', confidence: 0.72 },
    { id: 's7', studentId: 'STU007', name: 'Chen Wei', defaultStatus: 'absent', confidence: 0.0 },
    { id: 's8', studentId: 'STU008', name: 'Chloe Bennett', defaultStatus: 'present', confidence: 0.95 },
  ];

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch {
      toast.error('Unable to access webcam. Please upload an image or use sample frame.');
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture snapshot from webcam
  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, 640, 480);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      processImageForFaces(dataUrl);
    }
  };

  // Upload classroom image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        processImageForFaces(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use a simulated sample frame
  const useSampleFrame = () => {
    // Generate an illustrative canvas with student avatars
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background lecture hall
      ctx.fillStyle = '#263238';
      ctx.fillRect(0, 0, 640, 480);

      ctx.fillStyle = '#37474f';
      ctx.fillRect(40, 80, 560, 360);

      // Student outlines
      const sampleSpots = [
        { x: 120, y: 120, label: 'Alex J.' },
        { x: 260, y: 130, label: 'Priya S.' },
        { x: 410, y: 120, label: 'Elena R.' },
        { x: 180, y: 260, label: 'Marcus V.' },
        { x: 340, y: 250, label: 'David K.' },
      ];

      sampleSpots.forEach((spot) => {
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.arc(spot.x + 40, spot.y + 40, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2d7d2d';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(spot.label, spot.x + 20, spot.y + 100);
      });

      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      processImageForFaces(dataUrl);
    }
  };

  // Run face detection on image
  const processImageForFaces = async (base64Image: string) => {
    setCapturing(true);
    setFaces([]);
    try {
      const res = await aiApi.detectFaces({ image_base64: base64Image });
      if (res.success && res.data) {
        const data = res.data as any;
        setFaces(data.faces || []);
        setIsMock(data.is_mock ?? true);
        setProcessingTime(data.processing_time_ms ?? 48);
        drawBoundingBoxes(data.faces || []);
        toast.success(`Detected ${data.face_count || data.faces?.length || 5} faces successfully!`);
      } else {
        fallbackDetection();
      }
    } catch {
      fallbackDetection();
    } finally {
      setCapturing(false);
    }
  };

  const fallbackDetection = () => {
    const mockBoxes: DetectionBox[] = [
      { x: 120, y: 80, width: 90, height: 110, confidence: 0.96 },
      { x: 260, y: 95, width: 85, height: 105, confidence: 0.94 },
      { x: 410, y: 85, width: 95, height: 115, confidence: 0.89 },
      { x: 180, y: 220, width: 88, height: 108, confidence: 0.91 },
      { x: 340, y: 215, width: 92, height: 112, confidence: 0.93 },
    ];
    setFaces(mockBoxes);
    setIsMock(true);
    setProcessingTime(42.5);
    drawBoundingBoxes(mockBoxes);
    toast.success('Detected 5 student faces (Simulation Mode)!');
  };

  // Draw bounding boxes on canvas
  const drawBoundingBoxes = (boxes: DetectionBox[]) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach((box, i) => {
      const passesThreshold = box.confidence * 100 >= confidenceThreshold;
      const color = passesThreshold ? '#22c55e' : '#f59e0b';

      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Label background
      ctx.fillStyle = color;
      ctx.fillRect(box.x, box.y - 24, 110, 24);

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(
        `Face #${i + 1} (${Math.round(box.confidence * 100)}%)`,
        box.x + 6,
        box.y - 7
      );
    });
  };

  useEffect(() => {
    if (faces.length > 0) {
      drawBoundingBoxes(faces);
    }
  }, [confidenceThreshold, faces]);

  const activeFaces = faces.filter((f) => f.confidence * 100 >= confidenceThreshold);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/sessions"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sessions</span>
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
          Session ID: {id || 'sess-101'}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">
            Computer Vision Attendance Capture
          </h1>
          <p className="text-sm text-charcoal-500">
            Detect faces in real-time or upload a classroom snapshot to automate attendance
          </p>
        </div>

        {/* Mock disclaimer badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isMock ? 'Mock Vision Active (OpenCV Safe Mode)' : 'Live OpenCV Engine'}</span>
        </div>
      </div>

      {/* Main Vision Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera / Viewport Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full aspect-4/3 bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-800 flex items-center justify-center shadow-inner">
            {/* Live Video */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
            />

            {/* Static Captured Image */}
            {capturedImage && !streamActive && (
              <img
                src={capturedImage}
                alt="Classroom Capture"
                className="w-full h-full object-cover"
              />
            )}

            {/* Canvas for Video Snapshots (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay Canvas for Bounding Boxes */}
            <canvas
              ref={overlayCanvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Initial State Placeholder */}
            {!streamActive && !capturedImage && (
              <div className="text-center p-8">
                <Camera className="w-12 h-12 text-charcoal-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-charcoal-300">
                  Camera Feed Not Started
                </h3>
                <p className="text-xs text-charcoal-500 max-w-xs mt-1">
                  Start your webcam, upload a classroom photo, or use the prebuilt sample frame.
                </p>
              </div>
            )}

            {/* Face Count HUD Overlay */}
            {faces.length > 0 && (
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-semibold flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{activeFaces.length} Faces Verified</span>
                {processingTime && (
                  <span className="text-charcoal-400 font-mono">({processingTime} ms)</span>
                )}
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="bg-surface rounded-2xl border border-charcoal-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              {!streamActive ? (
                <button
                  onClick={startCamera}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={captureSnapshot}
                    disabled={capturing}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
                  >
                    <RefreshCw className={`w-4 h-4 ${capturing ? 'animate-spin' : ''}`} />
                    <span>Take Snapshot</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-charcoal-100 transition"
                  >
                    Stop
                  </button>
                </>
              )}

              <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-charcoal-300 text-xs font-semibold text-charcoal-700 hover:bg-charcoal-50 transition cursor-pointer">
                <Upload className="w-4 h-4 text-charcoal-500" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={useSampleFrame}
                className="px-3 py-2 rounded-xl border border-charcoal-300 text-xs font-semibold text-charcoal-600 hover:bg-charcoal-50 transition"
              >
                Sample Frame
              </button>
            </div>

            {/* Confidence Slider */}
            <div className="flex items-center space-x-2 text-xs text-charcoal-600">
              <Sliders className="w-3.5 h-3.5 text-charcoal-400" />
              <span>Threshold: {confidenceThreshold}%</span>
              <input
                type="range"
                min={50}
                max={95}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-20 accent-primary-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Matched Students & Review Action Panel */}
        <div className="bg-surface rounded-2xl border border-charcoal-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
              <div>
                <h2 className="text-base font-bold text-charcoal-900">Detected Cohort</h2>
                <p className="text-xs text-charcoal-500">Live facial recognition match</p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeFaces.length} / {enrolledStudents.length} Present
              </span>
            </div>

            <div className="mt-4 space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {enrolledStudents.map((stu, i) => {
                const isPresent = i < activeFaces.length;
                return (
                  <div
                    key={stu.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition ${
                      isPresent
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-charcoal-50/50 border-charcoal-200 text-charcoal-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          isPresent
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-charcoal-200 text-charcoal-700'
                        }`}
                      >
                        {stu.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal-900">{stu.name}</p>
                        <p className="text-[10px] text-charcoal-500 font-mono">{stu.studentId}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isPresent ? (
                        <>
                          <span className="font-mono text-emerald-700 font-semibold">
                            {Math.round(stu.confidence * 100)}%
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </>
                      ) : (
                        <span className="text-charcoal-400 italic">Not in frame</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-charcoal-100 mt-6">
            <button
              onClick={() => {
                navigate(`/sessions/${id || 'sess-101'}/review`);
                toast.success('Transitioning to Teacher Confirmation Grid.');
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-xs"
            >
              <span>Review & Confirm Attendance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-charcoal-400 text-center mt-2">
              Human-in-the-loop: Teacher will review and adjust records before final submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
