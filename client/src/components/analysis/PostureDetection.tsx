import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initPostureDetection, detectPosture } from "@/lib/posture-detection";
import { calculatePostureScore } from "@/lib/posture-scoring";
import { useCamera } from "@/hooks/use-camera";

const PostureDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [postureStatus, setPostureStatus] = useState<'good' | 'warning' | 'bad' | null>(null);
  const [detector, setDetector] = useState<any>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  const { isCameraReady, startCamera, stopCamera } = useCamera(videoRef);

  useEffect(() => {
    const loadDetector = async () => {
      try {
        const model = await initPostureDetection();
        setDetector(model);
      } catch (error) {
        console.error("Failed to initialize pose detection:", error);
      }
    };

    loadDetector();

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let timer: number | null = null;
    
    if (isAnalyzing) {
      timer = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [isAnalyzing]);

  const startAnalysis = async () => {
    if (!isCameraReady) {
      await startCamera();
    }
    
    setIsAnalyzing(true);
    setSessionTime(0);
    
    // Start continuous pose detection
    const id = window.setInterval(async () => {
      if (videoRef.current && canvasRef.current && detector) {
        const poses = await detectPosture(detector, videoRef.current);
        
        if (poses && poses.length > 0) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            // Clear previous drawings
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            // Draw keypoints and calculate posture score
            const score = calculatePostureScore(poses[0], canvasRef.current);
            
            // Update status based on score
            if (score >= 85) {
              setPostureStatus('good');
            } else if (score >= 70) {
              setPostureStatus('warning');
            } else {
              setPostureStatus('bad');
            }
          }
        }
      }
    }, 100);
    
    setIntervalId(id);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (intervalId) {
      window.clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="relative">
        <div className="rounded-lg overflow-hidden shadow-inner relative aspect-[4/3] bg-gray-900">
          {!isCameraReady && !isAnalyzing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <p>Camera access required for posture analysis</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                playsInline
                style={{ display: isAnalyzing ? 'block' : 'none' }}
              />
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                width={640}
                height={480}
              />
            </>
          )}
          
          {/* Status Overlay */}
          {postureStatus && isAnalyzing && (
            <div className={`absolute bottom-4 left-0 right-0 mx-auto w-max 
              ${postureStatus === 'good' ? 'bg-green-500' : 
                postureStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'} 
              text-white px-4 py-2 rounded-full font-medium flex items-center shadow-lg`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                {postureStatus === 'good' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : postureStatus === 'warning' ? (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {postureStatus === 'good' ? 'Good Posture' : 
               postureStatus === 'warning' ? 'Adjust Posture' : 'Poor Posture'}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <Button 
          onClick={isAnalyzing ? stopAnalysis : startAnalysis}
          className={`${isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-700'} text-white font-semibold px-6 py-3 shadow transition`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isAnalyzing ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              )}
            </svg>
            {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
          </div>
        </Button>
        
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Session Time: {formatTime(sessionTime)}
        </div>
      </div>
    </div>
  );
};

export default PostureDetection;
