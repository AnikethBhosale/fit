import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExerciseProps {
  exercise: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    sets: string;
  };
  onStart: () => void;
}

const ExerciseCard = ({ exercise, onStart }: ExerciseProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-primary text-white';
      case 'Intermediate':
        return 'bg-yellow-500 text-white';
      case 'Advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="relative">
        <img 
          src={exercise.imageUrl} 
          alt={exercise.title} 
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-4 right-4 ${getLevelColor(exercise.level)} text-xs font-bold px-2 py-1 rounded`}>
          {exercise.level}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{exercise.description}</p>
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">Duration: {exercise.duration}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">{exercise.sets}</span>
          </div>
        </div>
        <Button 
          onClick={onStart}
          className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-2 rounded-lg shadow transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Exercise
        </Button>
      </div>
    </Card>
  );
};

export default ExerciseCard;
