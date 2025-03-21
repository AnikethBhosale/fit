/**
 * Calculates a posture score based on pose detection.
 * 
 * @param pose - The detected pose object from TensorFlow.js
 * @param canvas - The canvas element for visualization
 * @returns - A score between 0-100
 */
export function calculatePostureScore(pose: any, canvas: HTMLCanvasElement) {
  if (!pose || !pose.keypoints) {
    return 0;
  }
  
  const keypoints = pose.keypoints;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  
  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Helper function to find keypoint by name
  const findKeypoint = (name: string) => keypoints.find((kp: any) => kp.name === name);
  
  // Get relevant keypoints
  const nose = findKeypoint('nose');
  const leftShoulder = findKeypoint('left_shoulder');
  const rightShoulder = findKeypoint('right_shoulder');
  const leftEar = findKeypoint('left_ear');
  const rightEar = findKeypoint('right_ear');
  const leftHip = findKeypoint('left_hip');
  const rightHip = findKeypoint('right_hip');
  
  // Initialize score components
  let headScore = 0;
  let shoulderScore = 0;
  let spineScore = 0;
  let totalKeypoints = 0;
  let detectedKeypoints = 0;
  
  // Draw keypoints and connections
  keypoints.forEach((keypoint: any) => {
    totalKeypoints++;
    
    if (keypoint.score > 0.3) {
      detectedKeypoints++;
      
      // Draw keypoint
      const { x, y } = keypoint;
      const scaledX = x * (canvas.width / 640);
      const scaledY = y * (canvas.height / 480);
      
      ctx.beginPath();
      ctx.arc(scaledX, scaledY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  
  // Draw connections (skeleton)
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
    const keypointA = findKeypoint(partA as string);
    const keypointB = findKeypoint(partB as string);
    
    if (keypointA && keypointB && keypointA.score > 0.3 && keypointB.score > 0.3) {
      const { x: xA, y: yA } = keypointA;
      const { x: xB, y: yB } = keypointB;
      
      const scaledXA = xA * (canvas.width / 640);
      const scaledYA = yA * (canvas.height / 480);
      const scaledXB = xB * (canvas.width / 640);
      const scaledYB = yB * (canvas.height / 480);
      
      ctx.beginPath();
      ctx.moveTo(scaledXA, scaledYA);
      ctx.lineTo(scaledXB, scaledYB);
      ctx.stroke();
    }
  });
  
  // Calculate head position score
  if (nose && leftEar && rightEar && leftShoulder && rightShoulder) {
    const earMidpointX = (leftEar.x + rightEar.x) / 2;
    const shoulderMidpointX = (leftShoulder.x + rightShoulder.x) / 2;
    
    const forwardHeadOffset = earMidpointX - shoulderMidpointX;
    
    // Ideal head position would have ears aligned with shoulders
    if (Math.abs(forwardHeadOffset) < 10) {
      headScore = 100;
    } else if (Math.abs(forwardHeadOffset) < 20) {
      headScore = 85;
    } else if (Math.abs(forwardHeadOffset) < 30) {
      headScore = 70;
    } else {
      headScore = 50;
    }
  }
  
  // Calculate shoulder alignment score
  if (leftShoulder && rightShoulder) {
    const shoulderHeightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Ideally shoulders should be at the same height
    if (shoulderHeightDiff < 5) {
      shoulderScore = 100;
    } else if (shoulderHeightDiff < 10) {
      shoulderScore = 90;
    } else if (shoulderHeightDiff < 20) {
      shoulderScore = 75;
    } else {
      shoulderScore = 60;
    }
  }
  
  // Calculate spine alignment score
  if (nose && leftShoulder && rightShoulder && leftHip && rightHip) {
    const shoulderMidpointX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipMidpointX = (leftHip.x + rightHip.x) / 2;
    
    const spineOffset = Math.abs(shoulderMidpointX - hipMidpointX);
    
    // Ideally the spine should be straight (shoulders above hips)
    if (spineOffset < 10) {
      spineScore = 100;
    } else if (spineOffset < 20) {
      spineScore = 85;
    } else if (spineOffset < 30) {
      spineScore = 70;
    } else {
      spineScore = 50;
    }
  }
  
  // Calculate confidence score based on detected keypoints
  const detectionConfidence = detectedKeypoints / totalKeypoints;
  
  // Calculate final score - weight the components
  const headWeight = 0.3;
  const shoulderWeight = 0.3;
  const spineWeight = 0.4;
  
  // Only calculate score if we have enough keypoints
  if (detectionConfidence < 0.5) {
    return 50; // Not enough keypoints detected for a reliable score
  }
  
  let finalScore = (
    (headScore * headWeight) +
    (shoulderScore * shoulderWeight) +
    (spineScore * spineWeight)
  );
  
  // Round to nearest integer
  return Math.round(finalScore);
}
