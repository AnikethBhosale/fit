import { useState } from "react";
import { useLocation } from "wouter";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Height of your fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            className="bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-bold text-xl text-primary">FitSync</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <button
              className={`font-medium ${isActive('/') ? 'text-primary' : 'text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400'} transition bg-transparent border-0 p-0 cursor-pointer`}
              onClick={() => scrollToSection("home")}
            >
              Home
            </button>
            <button
              className={`font-medium ${isActive('/exercises') ? 'text-primary' : 'text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400'} transition bg-transparent border-0 p-0 cursor-pointer`}
              onClick={() => scrollToSection("exercises")}
            >
              Exercise
            </button>
            <button
              className={`font-medium ${isActive('/leaderboard') ? 'text-primary' : 'text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400'} transition bg-transparent border-0 p-0 cursor-pointer`}
              onClick={() => scrollToSection("leaderboard")}
            >
              Leaderboard
            </button>
            <button
              className={`font-medium ${isActive('/rewards') ? 'text-primary' : 'text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400'} transition bg-transparent border-0 p-0 cursor-pointer`}
              onClick={() => scrollToSection("rewards")}
            >
              Rewards
            </button>
            <button
              className={`font-medium ${isActive('/contact') ? 'text-primary' : 'text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400'} transition bg-transparent border-0 p-0 cursor-pointer`}
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>
          </nav>

          {/* Login/Profile */}
          <div className="flex items-center space-x-4">
            {/* Profile Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="hidden md:flex items-center space-x-1 bg-white hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                >
                  <span>Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 mt-1">
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Levels</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Achievements</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => scrollToSection("rewards")}>
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a4 4 0 118 0v7M5 8h14" />
                    </svg>
                    <span>Rewards</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Points</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login/Signup Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full bg-gray-200 dark:bg-gray-700 p-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 mt-1">
                <DropdownMenuItem onClick={openAuthModal} className="cursor-pointer">
                  Login / Sign Up
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => scrollToSection("rewards")}>
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a4 4 0 118 0v7M5 8h14" />
                    </svg>
                    <span>Your Rewards</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Your Points: 2540</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Your Level: Gold</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button 
              className="md:hidden rounded-md p-2 bg-gray-200 dark:bg-gray-700"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-4 space-y-1">
            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                closeMobileMenu();
                scrollToSection("home");
              }}
            >
              Home
            </button>

            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                closeMobileMenu();
                scrollToSection("leaderboard");
              }}
            >
              Leaderboard
            </button>

            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                closeMobileMenu();
                scrollToSection("rewards");
              }}
            >
              Rewards
            </button>

            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                closeMobileMenu();
                scrollToSection("exercises");
              }}
            >
              Exercises
            </button>

            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                closeMobileMenu();
                scrollToSection("contact");
              }}
            >
              Contact
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <p className="px-3 py-1 text-sm font-semibold text-gray-600 dark:text-gray-400">Profile</p>
              <button 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  closeMobileMenu();
                  //  scrollToSection("profile/levels");  //This would require a section with this id
                  window.location.href = "/profile/levels";
                }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Levels
                </div>
              </button>
              <button 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  closeMobileMenu();
                  // scrollToSection("profile/achievements"); //This would require a section with this id
                  window.location.href = "/profile/achievements";
                }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Achievements
                </div>
              </button>
              <button 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  closeMobileMenu();
                  // scrollToSection("profile/points"); //This would require a section with this id
                  window.location.href = "/profile/points";
                }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Points
                </div>
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <button 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  closeMobileMenu();
                  openAuthModal();
                }}
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
      </div>
    </header>
  );
};

export default Header;