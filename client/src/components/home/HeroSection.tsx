import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-primary to-primary-800 dark:from-primary-800 dark:to-primary-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-float">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Turn Your Workout into a Challenge!</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">Improve your posture, climb the leaderboard, and unlock rewards—all while making fitness fun!</p>
            <div className="inline-flex items-center space-x-4">
              <button className="gradient-btn"
                onClick={() => {
                  const element = document.getElementById('learn-more');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 max-w-lg">
            <img 
              src="https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=800&q=80" 
              alt="Person with good posture working at desk" 
              className="rounded-xl shadow-2xl"
              width="800"
              height="600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;