import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ProgressCard from "@/components/leaderboard/ProgressCard";
import { apiRequest } from "@/lib/queryClient";

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  streak: string;
  initial: string;
  isCurrentUser?: boolean;
  isVip?: boolean;
}

const LeaderboardSection = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([
    { rank: 1, name: "Sarah J.", score: 98, streak: "14 days", initial: "S", isVip: true },
    { rank: 2, name: "Michael T.", score: 95, streak: "10 days", initial: "M" },
    { rank: 3, name: "Jessica K.", score: 93, streak: "7 days", initial: "J" },
    { rank: 4, name: "Alex W.", score: 91, streak: "5 days", initial: "A" },
    { rank: 5, name: "Ryan L.", score: 89, streak: "4 days", initial: "R" }
  ]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await apiRequest('GET', '/api/leaderboard', undefined);
        const data = await response.json();

        if (data && data.users) {
          setLeaderboardData(data.users);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    // fetchLeaderboard();
    // For now we're using static data
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Leaderboard</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how your posture ranks against others and stay motivated!
          </p>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Leaderboard Table */}
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Top Posture Masters</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-600 text-left text-gray-800 dark:text-gray-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Rank</th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Score</th>
                      <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboardData.map((user, index) => (
                      <tr key={index} className={user.isCurrentUser ? "bg-primary-50 dark:bg-primary-900/30" : ""}>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{user.rank}</td>
                        <td className="py-3 px-4 flex items-center">
                          <span className={`h-8 w-8 rounded-full ${user.isCurrentUser ? 'bg-primary-100 dark:bg-primary-800 text-primary dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700'} flex items-center justify-center mr-3 font-medium text-gray-900 dark:text-white`}>
                            {user.initial}
                          </span>
                          <span className="text-gray-900 dark:text-white">{user.name}</span>
                          {user.isVip && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{user.score}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{user.streak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Your Progress Card */}
            <div className="md:w-1/3">
              <ProgressCard />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LeaderboardSection;