import { useState, useEffect, useRef } from "react";
import ExerciseCard from "@/components/exercises/ExerciseCard";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const ExercisesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const [exercises, setExercises] = useState([
    {
      id: "1",
      title: "Arm Raise",
      description: "Simple arm raises to improve shoulder mobility.",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80",
      level: "Beginner",
      duration: "2-3 mins",
      sets: "3 sets of 10 reps"
    },
    {
      id: "2",
      title: "Squat",
      description: "Basic squats for lower body strength.",
      imageUrl: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?auto=format&fit=crop&w=500&q=80",
      level: "Beginner",
      duration: "3-4 mins",
      sets: "3 sets of 12 reps"
    },
    {
      id: "3",
      title: "Plank",
      description: "Core strengthening exercise.",
      imageUrl: "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=500&q=80",
      level: "Intermediate",
      duration: "1-2 mins",
      sets: "3 sets of 30 seconds"
    },
    {
      id: "4",
      title: "Jumping Jack",
      description: "Full body cardio exercise.",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80",
      level: "Beginner",
      duration: "2-3 mins",
      sets: "3 sets of 20 reps"
    },
    {
      id: "5",
      title: "Push-Up",
      description: "Upper body strength exercise.",
      imageUrl: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?auto=format&fit=crop&w=500&q=80",
      level: "Advanced",
      duration: "2-3 mins",
      sets: "3 sets of 15 reps"
    }
  ]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, [exercises]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(scrollContainerRef.current.scrollLeft + scrollAmount);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const startExercise = (id: string) => {
    console.log(`Starting exercise: ${id}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Exercises</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Try these exercises to improve your posture and relieve tension.
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg"
            disabled={scrollPosition <= 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
          >
            {exercises.map((exercise) => (
              <div key={exercise.id} className="flex-none w-[calc(33.333%-1rem)] mx-2 snap-center">
                <ExerciseCard 
                  exercise={exercise}
                  onStart={() => startExercise(exercise.id)}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg"
            disabled={scrollPosition >= maxScroll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {exercises.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === Math.round(scrollPosition / (maxScroll / (exercises.length - 1)))
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExercisesSection;