
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface PostureCard {
  title: string;
  description?: string;
  imageUrl: string;
}

const postures: PostureCard[] = [
  {
    title: "Arm Raise",
    description: "Lift arms straight up, keeping shoulders relaxed",
    imageUrl: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=400"
  },
  {
    title: "Squat",
    description: "Keep back straight and feet shoulder-width apart",
    imageUrl: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=400"
  },
  {
    title: "Plank",
    description: "Maintain straight line from head to heels",
    imageUrl: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=400"
  },
  {
    title: "Jumping Jack",
    description: "Coordinate arm and leg movements smoothly",
    imageUrl: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=400"
  },
  {
    title: "Push-Up",
    description: "Keep core engaged throughout the movement",
    imageUrl: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=400"
  }
];

const PostureExamples = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Posture Analysis</h2>
        <div className="relative w-full max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {postures.map((posture, index) => (
                <CarouselItem key={index} className="basis-1/3">
                  <div className="p-2">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={posture.imageUrl} 
                        alt={posture.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{posture.title}</h3>
                        {posture.description && (
                          <p className="text-gray-600 text-sm">{posture.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default PostureExamples;
