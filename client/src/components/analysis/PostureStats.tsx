import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface PostureIssue {
  name: string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Slight Forward Tilt';
  statusType: 'success' | 'warning' | 'danger';
}

const PostureExamples = () => {
  const postures = [
    { title: "Arm Raise", image: "/images/armraise.jpg", description: "Raise your arms overhead." },
    { title: "Squat", image: "/images/squat.jpg", description: "Bend your knees and lower your hips." },
    { title: "Plank", image: "/images/plank.jpg", description: "Hold a straight line from head to heels." },
    { title: "Jumping Jack", image: "/images/jumpingjack.jpg", description: "Jump with legs wide and arms overhead." },
    { title: "Push-Up", image: "/images/pushup.jpg", description: "Lower your chest to the floor." }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(postures.length / itemsPerPage);

  const startIndex = currentSlide * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, postures.length);
  const currentPostures = postures.slice(startIndex, endIndex);


  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">Posture Analysis</h3>
      <div className="flex">
        {currentPostures.map((posture, index) => (
          <div key={index} className="w-64 m-2">
            <Card>
              <img src={posture.image} alt={posture.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-medium">{posture.title}</h4>
                {posture.description && <p className="text-sm">{posture.description}</p>}
              </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ${
              i === currentSlide ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => setCurrentSlide(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide -1))}
          disabled={currentSlide === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
        >
          &lt;
        </button>
        <button
          onClick={() => setCurrentSlide(Math.min(totalPages - 1, currentSlide + 1))}
          disabled={currentSlide === totalPages - 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};


const PostureStats = () => {
  const [score, setScore] = useState(92);
  const [issues, setIssues] = useState<PostureIssue[]>([
    { 
      name: 'Shoulder Alignment', 
      status: 'Excellent', 
      statusType: 'success' 
    },
    { 
      name: 'Head Position', 
      status: 'Slight Forward Tilt', 
      statusType: 'warning' 
    },
    { 
      name: 'Spine Curvature', 
      status: 'Good', 
      statusType: 'success' 
    }
  ]);

  const [suggestions, setSuggestions] = useState([
    "Try chin tucks to improve head position",
    "Take a short break every 25 minutes"
  ]);

  // In a real app, we would track the user's posture over time and update these stats
  useEffect(() => {
    const fetchPostureStats = async () => {
      try {
        const response = await apiRequest('GET', '/api/posture-stats', undefined);
        const data = await response.json();

        if (data) {
          setScore(data.score);
          if (data.issues) setIssues(data.issues);
          if (data.suggestions) setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error("Error fetching posture stats:", error);
      }
    };

    // fetchPostureStats();
    // For demo purposes, we're just using static data
  }, []);

  const getStatusIcon = (statusType: string) => {
    if (statusType === 'success') {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (statusType === 'warning') {
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
  };

  return (
    <>
      <PostureExamples />
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Posture Stats</h3>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Current Score</span>
            <span className="text-2xl font-bold text-green-500">{score}/100</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(issue.statusType)}
                <span className="font-medium">{issue.name}</span>
              </div>
              <span className={`font-semibold 
                ${issue.statusType === 'success' ? 'text-green-500' : 
                  issue.statusType === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                {issue.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold mb-3">Suggestions</h4>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PostureStats;