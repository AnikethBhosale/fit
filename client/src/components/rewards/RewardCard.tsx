import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RewardProps {
  reward: {
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
  };
  onClaim: () => void;
}

const RewardCard = ({ reward, onClaim }: RewardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl hover:transform hover:-translate-y-1">
      <div className={`h-48 bg-gradient-to-r ${reward.levelColor} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={reward.imageUrl} 
            alt={reward.title} 
            className="object-cover w-full h-full mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`bg-${reward.level === 'Gold' ? 'amber' : reward.level === 'Silver' ? 'primary' : 'emerald'}-500 text-white text-sm font-bold px-3 py-1 rounded-full`}>
              {reward.level} Level
            </span>
            <h3 className="text-white text-xl font-bold mt-2">{reward.title}</h3>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 dark:text-gray-300 mb-4">{reward.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                <div 
                  className={`${reward.level === 'Gold' ? 'bg-amber-500' : reward.level === 'Silver' ? 'bg-primary' : 'bg-emerald-500'} h-2 rounded-full`} 
                  style={{ width: `${reward.progress.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{reward.progress.current}/{reward.progress.total}</span>
            </div>
          </div>
          {reward.isUnlocked ? (
            <Button 
              onClick={onClaim}
              className={`${reward.level === 'Gold' ? 'bg-amber-600 hover:bg-amber-700' : 
                reward.level === 'Silver' ? 'bg-primary hover:bg-primary-700' : 
                'bg-emerald-600 hover:bg-emerald-700'} 
                text-white px-4 py-2 rounded-lg text-sm font-medium transition`}
            >
              Claim
            </Button>
          ) : (
            <Button 
              disabled
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Locked
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RewardCard;
