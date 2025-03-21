/**
 * Initializes the pose detection model.
 * 
 * @returns - A PoseDetector instance from TensorFlow.js
 */
export async function initPostureDetection() {
  try {
    // Using MoveNet - one of the best models for real-time pose detection
    // @ts-ignore - TensorFlow.js types are not available
    const detectorConfig = {
      modelType: 'MoveNet',
      variant: 'lightning',
      enableSmoothing: true
    };
    
    // @ts-ignore - TensorFlow.js types are not available
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet, 
      detectorConfig
    );
    
    return detector;
  } catch (error) {
    console.error("Error initializing posture detection:", error);
    throw error;
  }
}

/**
 * Detects poses in a video frame.
 * 
 * @param detector - The pose detector model
 * @param video - The video element to analyze
 * @returns - Array of detected poses
 */
export async function detectPosture(detector: any, video: HTMLVideoElement) {
  try {
    const poses = await detector.estimatePoses(video, {
      flipHorizontal: false,
      maxPoses: 1
    });
    
    return poses;
  } catch (error) {
    console.error("Error detecting posture:", error);
    return null;
  }
}

/**
 * Draws the skeleton on a canvas.
 * 
 * @param pose - The detected pose
 * @param canvas - The canvas element to draw on
 */
export function drawSkeleton(pose: any, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw keypoints
  const keypoints = pose.keypoints;
  ctx.fillStyle = 'white';
  
  keypoints.forEach((keypoint: any) => {
    if (keypoint.score > 0.3) {
      const { x, y } = keypoint;
      
      // Scale coordinates to canvas size
      const scaledX = x * (canvas.width / video.width);
      const scaledY = y * (canvas.height / video.height);
      
      // Draw keypoint
      ctx.beginPath();
      ctx.arc(scaledX, scaledY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  
  // Draw lines between connected keypoints (skeleton)
  const connections = [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
  ];
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  
  connections.forEach(([partA, partB]) => {
    const keypointA = keypoints.find((kp: any) => kp.name === partA);
    const keypointB = keypoints.find((kp: any) => kp.name === partB);
    
    if (keypointA && keypointB && keypointA.score > 0.3 && keypointB.score > 0.3) {
      const { x: xA, y: yA } = keypointA;
      const { x: xB, y: yB } = keypointB;
      
      // Scale coordinates to canvas size
      const scaledXA = xA * (canvas.width / video.width);
      const scaledYA = yA * (canvas.height / video.height);
      const scaledXB = xB * (canvas.width / video.width);
      const scaledYB = yB * (canvas.height / video.height);
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(scaledXA, scaledYA);
      ctx.lineTo(scaledXB, scaledYB);
      ctx.stroke();
    }
  });
}
