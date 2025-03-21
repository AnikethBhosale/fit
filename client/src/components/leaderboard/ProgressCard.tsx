import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const ProgressCard = () => {
  const [score, setScore] = useState(92);
  const [weekDays, setWeekDays] = useState([
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: false },
    { day: 'S', completed: false }
  ]);
  const [rank, setRank] = useState('6th of 42');
  const [rankPercentage, setRankPercentage] = useState(85);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await apiRequest('GET', '/api/user/progress', undefined);
        const data = await response.json();
        
        if (data) {
          if (data.score) setScore(data.score);
          if (data.weekDays) setWeekDays(data.weekDays);
          if (data.rank) setRank(data.rank);
          if (data.rankPercentage) setRankPercentage(data.rankPercentage);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    // fetchUserProgress();
    // For now we're using static data
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e0e0e0" strokeWidth="2" />
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="#4F46E5" 
                strokeWidth="2" 
                strokeDasharray={`${score}, 100`} 
                strokeDashoffset="25" 
                className="transform -rotate-90 origin-center"
              />
              <text 
                x="18" 
                y="18" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="text-xs font-bold" 
                fill="#4F46E5"
              >
                {score}%
              </text>
            </svg>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">Weekly Streak</span>
              <span className="font-medium text-primary">5 days</span>
            </div>
            <div className="flex space-x-1">
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`h-8 w-8 rounded-md ${day.completed ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'} flex items-center justify-center text-xs`}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">Your Rank</span>
              <span className="font-medium text-primary">{rank}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${rankPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-2 rounded-lg shadow transition mt-2">
            View Full Stats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
