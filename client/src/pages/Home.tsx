import HeroSection from "@/components/home/HeroSection";
import InfoSection from "@/components/home/InfoSection";
import LeaderboardSection from "@/components/leaderboard/LeaderboardSection";
import RewardsSection from "@/components/rewards/RewardsSection";
import ExercisesSection from "@/components/exercises/ExercisesSection";
import ContactSection from "@/components/contact/ContactSection";
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const handleNavigationClick = (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1); //remove '#'
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const navigationLinks = document.querySelectorAll('nav a'); //Assumes you have a nav element with links
    navigationLinks.forEach(link => link.addEventListener('click', handleNavigationClick));

    return () => {
      navigationLinks.forEach(link => link.removeEventListener('click', handleNavigationClick));
    }
  }, []);

  return (
    <>
      <nav> {/* Add your navigation links here,  e.g., */}
        <a href="#home">Home</a>
        <a href="#exercises">Exercises</a>
        <a href="#leaderboard">Leaderboard</a>
        <a href="#rewards">Rewards</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="min-h-screen bg-background">
        <div id="home">
          <HeroSection />
        </div>
        <div id="info"> {/* Added ID for InfoSection */}
          <InfoSection />
        </div>
        <div id="exercises">
          <ExercisesSection />
        </div>
        <div id="leaderboard">
          <LeaderboardSection />
        </div>
        <div id="rewards"> {/* Added ID for RewardsSection */}
          <RewardsSection />
        </div>
        <div id="contact"> {/* Added ID for ContactSection */}
          <ContactSection />
        </div>
      </div>
    </>
  );
};

export default Home;