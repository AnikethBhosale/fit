import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for handling camera access and video streaming
 */
export function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { toast } = useToast();
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      return new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                setIsCameraReady(true);
                resolve();
              }).catch(error => {
                console.error("Error playing video:", error);
                toast({
                  title: "Error",
                  description: "Could not start video playback. Please try again.",
                  variant: "destructive"
                });
              });
            }
          };
        }
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Error",
        description: "Please allow camera access to use posture analysis.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setIsCameraReady(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    isCameraReady,
    startCamera,
    stopCamera
  };
}
