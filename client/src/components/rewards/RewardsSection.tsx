import { useState, useEffect } from "react";
import RewardCard from "@/components/rewards/RewardCard";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  level: 'Bronze' | 'Silver' | 'Gold';
  levelColor: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  isUnlocked: boolean;
}

const RewardsSection = () => {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "1",
      title: "50% Off Gym Membership",
      description: "Maintain excellent posture for 14 consecutive days to unlock this reward.",
      imageUrl: "https://images.unsplash.com/photo-1494178270175-e96de6971df1?auto=format&fit=crop&w=500&q=80",
      level: "Gold",
      levelColor: "from-amber-400 to-amber-600",
      progress: {
        current: 9,
        total: 14,
        percentage: 65
      },
      isUnlocked: false
    },
    {
      id: "2",
      title: "20% Off Ergonomic Chairs",
      description: "Achieve an average posture score of 85+ for 7 days to unlock this reward.",
      imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=500&q=80",
      level: "Silver",
      levelColor: "from-primary-400 to-primary-600",
      progress: {
        current: 7,
        total: 7,
        percentage: 100
      },
      isUnlocked: true
    },
    {
      id: "3",
      title: "Free Wellness App Subscription",
      description: "Complete 5 posture analysis sessions to unlock this reward.",
      imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=500&q=80",
      level: "Bronze",
      levelColor: "from-emerald-400 to-emerald-600",
      progress: {
        current: 5,
        total: 5,
        percentage: 100
      },
      isUnlocked: true
    }
  ]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await apiRequest('GET', '/api/rewards', undefined);
        const data = await response.json();
        
        if (data && data.rewards) {
          setRewards(data.rewards);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };

    // fetchRewards();
    // For now we're using static data
  }, []);

  const handleClaimReward = async (rewardId: string) => {
    try {
      await apiRequest('POST', `/api/rewards/${rewardId}/claim`, undefined);
      
      // Update local state to reflect the claimed reward
      setRewards(rewards.map(reward => 
        reward.id === rewardId 
          ? { ...reward, isClaimed: true }
          : reward
      ));
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Earn Rewards</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Maintain good posture and unlock exclusive rewards from our partners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {rewards.map((reward) => (
            <RewardCard 
              key={reward.id}
              reward={reward}
              onClaim={() => handleClaimReward(reward.id)}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium px-6 py-3 rounded-lg shadow transition">
            View All Rewards
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
