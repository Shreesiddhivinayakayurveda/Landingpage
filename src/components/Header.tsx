import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../asstes/logo.png';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // Handle clicks outside of navbar to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  
  // Set up intersection observer to track which section is in view
  useEffect(() => {
    if (!isHomePage) return;
    
    // Set home as default active section when page loads
    if (activeSection === '') {
      setActiveSection('home');
    }
    
    // Define all section IDs to observe, including home
    const sectionIds = ['home', 'therapies', 'why-us', 'appointment', 'about', 'contact'];
    
    // Track the last visible sections to handle edge cases
    let visibleSections: string[] = [];
    
    const observerOptions = {
      root: null,
      rootMargin: '-5% 0px -5% 0px', // Adjusted for better detection
      threshold: [0.1, 0.2, 0.3] // Multiple thresholds for better accuracy
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // First, update our list of visible sections
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        
        if (entry.isIntersecting) {
          // Add to visible sections if not already there
          if (!visibleSections.includes(sectionId)) {
            visibleSections.push(sectionId);
          }
        } else {
          // Remove from visible sections
          visibleSections = visibleSections.filter(id => id !== sectionId);
        }
      });
      
      // If we have visible sections, set the active section to the first one
      // (which will be the topmost visible section)
      if (visibleSections.length > 0) {
        // Special handling for scrolling to top
        if (window.scrollY < 100 && visibleSections.includes('home')) {
          setActiveSection('home');
        } else {
          // For other cases, prioritize the first visible section
          setActiveSection(visibleSections[0]);
        }
        console.log('Active section:', visibleSections[0]); // Debug log
      } else if (window.scrollY < 100) {
        // If no sections are visible and we're at the top, default to home
        setActiveSection('home');
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log('Observing section:', id); // Debug log
        observer.observe(element);
      } else {
        console.log('Section not found:', id); // Debug log
      }
    });
    
    // Add scroll event listener for edge cases
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage, location.pathname]);

  return (
    <nav ref={navRef} className="fixed w-full z-20 bg-gradient-to-r from-white/90 via-white/80 to-green-50/80 backdrop-blur-md shadow-md px-4 md:px-12 border-b border-green-100">
      <div className="w-full py-2 flex justify-between items-center transition-all duration-300 ease-in-out">
        {/* Logo */}
        <div className="flex items-center pl-0 md:pl-4 transition-transform duration-300 hover:scale-105">
          <img src={logoImage} alt="Shree Siddhivinayak Ayurveda Logo" className="h-[5.5rem] md:h-[5rem] w-auto drop-shadow-sm" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 pr-4 font-medium">
          {isHomePage ? (
            // Links for home page - anchor tags for smooth scrolling
            <>
              <a href="#" className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${activeSection === '' || activeSection === 'home' ? 'text-orange-500' : ''}`}>
                Home
                <span className={`block h-0.5 ${activeSection === '' || activeSection === 'home' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </a>
              
              <a href="#therapies" className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${activeSection === 'therapies' ? 'text-orange-500' : ''}`}>
                Therapies
                <span className={`block h-0.5 ${activeSection === 'therapies' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </a>
              
              <Link 
                to="/hero" 
                onClick={() => window.scrollTo(0, 0)}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.pathname === '/hero' ? 'text-orange-500' : ''}`}
              >
                Our Clinic
                <span className={`block h-0.5 ${location.pathname === '/hero' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link 
                to="/achievements" 
                onClick={() => window.scrollTo(0, 0)}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.pathname === '/achievements' ? 'text-orange-500' : ''}`}
              >
                Achievements
                <span className={`block h-0.5 ${location.pathname === '/achievements' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <a href="#why-us" className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${activeSection === 'why-us' ? 'text-orange-500' : ''}`}>
                Why Choose Us
                <span className={`block h-0.5 ${activeSection === 'why-us' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </a>
              
              <a href="#appointment" className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${activeSection === 'appointment' ? 'text-orange-500' : ''}`}>
                Appointment
                <span className={`block h-0.5 ${activeSection === 'appointment' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </a>
              
              <a href="#about" className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${activeSection === 'about' ? 'text-orange-500' : ''}`}>
                About
                <span className={`block h-0.5 ${activeSection === 'about' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </a>
              
              <a href="#contact" className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${activeSection === 'contact' ? 'text-orange-500' : ''}`}>
                Contact
                <span className={`block h-0.5 ${activeSection === 'contact' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </a>
            </>
          ) : (
            // Links for therapy pages - React Router Links
            <>
              <Link 
                to="/" 
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.pathname === '/' ? 'text-orange-500' : ''}`}
              >
                Home
                <span className={`block h-0.5 ${location.pathname === '/' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('therapies');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.hash === '#therapies' ? 'text-orange-500' : ''}`}
              >
                Therapies
                <span className={`block h-0.5 ${location.hash === '#therapies' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link 
                to="/hero" 
                onClick={() => window.scrollTo(0, 0)}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.pathname === '/hero' ? 'text-orange-500' : ''}`}
              >
                Our Clinic
                <span className={`block h-0.5 ${location.pathname === '/hero' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link 
                to="/achievements" 
                onClick={() => window.scrollTo(0, 0)}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.pathname === '/achievements' ? 'text-orange-500' : ''}`}
              >
                Achievements
                <span className={`block h-0.5 ${location.pathname === '/achievements' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('why-us');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.hash === '#why-us' ? 'text-orange-500' : ''}`}
              >
                Why Choose Us
                <span className={`block h-0.5 ${location.hash === '#why-us' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('appointment');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.hash === '#appointment' ? 'text-orange-500' : ''}`}
              >
                Appointment
                <span className={`block h-0.5 ${location.hash === '#appointment' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.hash === '#about' ? 'text-orange-500' : ''}`}
              >
                About
                <span className={`block h-0.5 ${location.hash === '#about' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 hover:text-orange-500 relative group transition-all duration-300 px-2 py-1 rounded-md hover:bg-green-50 ${location.hash === '#contact' ? 'text-orange-500' : ''}`}
              >
                Contact
                <span className={`block h-0.5 ${location.hash === '#contact' ? 'max-w-full' : 'max-w-0'} group-hover:max-w-full bg-orange-500 transition-all duration-500`}></span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden pr-1">
          <button
            onClick={toggleMenu}
            className="text-green-800 hover:text-orange-500 focus:outline-none transition-all duration-300 hover:scale-110 p-1.5 rounded-full hover:bg-green-50/80"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 w-full bg-gradient-to-b from-white/95 to-green-50/95 backdrop-blur-md shadow-md rounded-b-lg border-x border-b border-green-100 transform transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center py-4 space-y-2.5">
          {isHomePage ? (
            // Links for home page - anchor tags for smooth scrolling
            <>
              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${activeSection === '' || activeSection === 'home' ? 'text-orange-500' : ''}`}
              >
                <span>Home</span>
              </a>
              
              <a
                href="#therapies"
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${activeSection === 'therapies' ? 'text-orange-500' : ''}`}
              >
                <span>Therapies</span>
              </a>
              
              <Link
                to="/hero"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.pathname === '/hero' ? 'text-orange-500' : ''}`}
              >
                <span>Our Clinic</span>
              </Link>
              
              <Link
                to="/achievements"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.pathname === '/achievements' ? 'text-orange-500' : ''}`}
              >
                <span>Achievements</span>
              </Link>
              
              <a
                href="#why-us"
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${activeSection === 'why-us' ? 'text-orange-500' : ''}`}
              >
                <span>Why Choose Us</span>
              </a>
              
              <a
                href="#appointment"
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${activeSection === 'appointment' ? 'text-orange-500' : ''}`}
              >
                <span>Appointment</span>
              </a>
              
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${activeSection === 'about' ? 'text-orange-500' : ''}`}
              >
                <span>About</span>
              </a>
              
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${activeSection === 'contact' ? 'text-orange-500' : ''}`}
              >
                <span>Contact</span>
              </a>
            </>
          ) : (
            // Links for therapy pages - React Router Links
            <>
              <Link 
                to="/" 
                onClick={() => setMenuOpen(false)}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.pathname === '/' ? 'text-orange-500' : ''}`}
              >
                <span>Home</span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('therapies');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.hash === '#therapies' ? 'text-orange-500' : ''}`}
              >
                <span>Therapies</span>
              </Link>
              
              <Link 
                to="/hero" 
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.pathname === '/hero' ? 'text-orange-500' : ''}`}
              >
                <span>Our Clinic</span>
              </Link>
              
              <Link 
                to="/achievements" 
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.pathname === '/achievements' ? 'text-orange-500' : ''}`}
              >
                <span>Achievements</span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('why-us');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.hash === '#why-us' ? 'text-orange-500' : ''}`}
              >
                <span>Why Choose Us</span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('appointment');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.hash === '#appointment' ? 'text-orange-500' : ''}`}
              >
                <span>Appointment</span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.hash === '#about' ? 'text-orange-500' : ''}`}
              >
                <span>About</span>
              </Link>
              
              <Link
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`text-green-800 font-medium hover:text-orange-500 text-base w-full text-center px-6 py-2.5 rounded-md hover:bg-green-50/70 transition-all duration-300 flex items-center justify-center space-x-2 ${location.hash === '#contact' ? 'text-orange-500' : ''}`}
              >
                <span>Contact</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;