/**
 * Analyzes posture based on keypoints from pose detection.
 * 
 * @param pose - The detected pose object from TensorFlow.js
 * @returns - An object with posture analysis results
 */
export function analyzePosture(pose: any) {
  if (!pose || !pose.keypoints) {
    return {
      isGoodPosture: false,
      issues: [],
      score: 0
    };
  }
  
  const keypoints = pose.keypoints;
  const issues = [];
  let totalScore = 100; // Start with a perfect score and subtract points for issues
  
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
  const leftElbow = findKeypoint('left_elbow');
  const rightElbow = findKeypoint('right_elbow');
  
  // Check head position (forward head posture)
  if (nose && leftEar && rightEar && leftShoulder && rightShoulder) {
    const earMidpointX = (leftEar.x + rightEar.x) / 2;
    const shoulderMidpointX = (leftShoulder.x + rightShoulder.x) / 2;
    
    const forwardHeadOffset = earMidpointX - shoulderMidpointX;
    
    // If the head is too far forward compared to shoulders
    if (forwardHeadOffset > 20) {
      issues.push({
        name: 'Head Position',
        description: 'Forward head posture detected',
        severity: 'moderate',
        score: 70,
        suggestions: ['Try chin tucks exercise', 'Adjust monitor height']
      });
      totalScore -= 15;
    } else if (forwardHeadOffset > 10) {
      issues.push({
        name: 'Head Position',
        description: 'Slight forward head tilt',
        severity: 'mild',
        score: 85,
        suggestions: ['Be mindful of head position']
      });
      totalScore -= 5;
    } else {
      issues.push({
        name: 'Head Position',
        description: 'Good alignment',
        severity: 'none',
        score: 100,
        suggestions: []
      });
    }
  }
  
  // Check shoulder alignment (rounded shoulders)
  if (leftShoulder && rightShoulder && leftElbow && rightElbow) {
    // In a good posture, shoulders should be back (Z-axis, but we can use relative positions)
    
    // Check shoulder height difference (uneven shoulders)
    const shoulderHeightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    if (shoulderHeightDiff > 15) {
      issues.push({
        name: 'Shoulder Alignment',
        description: 'Uneven shoulders',
        severity: 'moderate',
        score: 70,
        suggestions: ['Focus on shoulder exercises', 'Check workstation ergonomics']
      });
      totalScore -= 15;
    } else if (shoulderHeightDiff > 8) {
      issues.push({
        name: 'Shoulder Alignment',
        description: 'Slightly uneven shoulders',
        severity: 'mild',
        score: 85,
        suggestions: ['Be mindful of shoulder position']
      });
      totalScore -= 5;
    } else {
      issues.push({
        name: 'Shoulder Alignment',
        description: 'Excellent alignment',
        severity: 'none',
        score: 100,
        suggestions: []
      });
    }
  }
  
  // Check spine curvature
  if (nose && leftShoulder && rightShoulder && leftHip && rightHip) {
    // For spine curvature, we check alignment between shoulders and hips
    const shoulderMidpointX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipMidpointX = (leftHip.x + rightHip.x) / 2;
    
    const spineOffset = Math.abs(shoulderMidpointX - hipMidpointX);
    
    if (spineOffset > 20) {
      issues.push({
        name: 'Spine Curvature',
        description: 'Significant spine misalignment',
        severity: 'high',
        score: 60,
        suggestions: ['Take frequent breaks', 'Consider core strengthening exercises']
      });
      totalScore -= 25;
    } else if (spineOffset > 10) {
      issues.push({
        name: 'Spine Curvature',
        description: 'Mild spine curvature issue',
        severity: 'moderate',
        score: 80,
        suggestions: ['Be mindful of sitting straight']
      });
      totalScore -= 10;
    } else {
      issues.push({
        name: 'Spine Curvature',
        description: 'Good spinal alignment',
        severity: 'none',
        score: 100,
        suggestions: []
      });
    }
  }
  
  // Ensure score stays within 0-100 range
  totalScore = Math.max(0, Math.min(100, totalScore));
  
  // Determine if overall posture is good
  const isGoodPosture = totalScore >= 85;
  
  return {
    isGoodPosture,
    issues,
    score: totalScore
  };
}

/**
 * Generates exercise recommendations based on posture analysis.
 * 
 * @param analysis - The result from analyzePosture
 * @returns - Array of recommended exercises
 */
export function getExerciseRecommendations(analysis: any) {
  const recommendations = [];
  
  if (!analysis || !analysis.issues) {
    return recommendations;
  }
  
  // Get exercises for specific issues
  analysis.issues.forEach((issue: any) => {
    if (issue.severity === 'none') return;
    
    switch (issue.name) {
      case 'Head Position':
        recommendations.push({
          id: 'chin-tucks',
          name: 'Chin Tucks',
          description: 'Helps correct forward head posture',
          priority: issue.severity === 'high' ? 'high' : 'medium'
        });
        break;
        
      case 'Shoulder Alignment':
        recommendations.push({
          id: 'shoulder-blade-squeezes',
          name: 'Shoulder Blade Squeezes',
          description: 'Helps with shoulder alignment and posture',
          priority: issue.severity === 'high' ? 'high' : 'medium'
        });
        
        recommendations.push({
          id: 'wall-angels',
          name: 'Wall Angels',
          description: 'Improves shoulder mobility and alignment',
          priority: issue.severity === 'high' ? 'high' : 'medium'
        });
        break;
        
      case 'Spine Curvature':
        recommendations.push({
          id: 'cat-cow-stretch',
          name: 'Cat-Cow Stretch',
          description: 'Improves spine flexibility and alignment',
          priority: issue.severity === 'high' ? 'high' : 'medium'
        });
        break;
    }
  });
  
  // Add general recommendations
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'posture-check-reminder',
      name: 'Regular Posture Checks',
      description: 'Set reminders to check your posture throughout the day',
      priority: 'low'
    });
  }
  
  // Add break recommendation for everyone
  recommendations.push({
    id: 'movement-breaks',
    name: 'Movement Breaks',
    description: 'Take a short break every 25-30 minutes to stand and stretch',
    priority: 'medium'
  });
  
  return recommendations;
}
