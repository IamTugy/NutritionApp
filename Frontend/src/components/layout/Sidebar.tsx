import { Link } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/utils/tw';
import { useEffect, useRef } from 'react';
import { Nutrition } from '@/pages/Nutrition';
import { useTheme } from '@/contexts/ThemeContext';

export function Sidebar() {
  const { isAuthenticated } = useAuth0();
  const { isOpen, toggle } = useSidebar();
  const { isDarkMode } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isOpen && window.innerWidth < 768) { // Only close on mobile
          toggle();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggle]);

  if (!isAuthenticated) return null;

  const className = cn(
    'group flex items-center p-2 text-base font-medium rounded-md',
    isDarkMode 
      ? '[&.active]:bg-gray-700 [&.active]:text-white text-gray-300 hover:bg-gray-700 hover:text-white' 
      : '[&.active]:bg-gray-100 [&.active]:text-gray-900 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed top-16 inset-x-0 bottom-0 bg-black/10 z-30 md:hidden"
          onClick={toggle}
        />
      )}
      <div
        ref={sidebarRef}
        className={cn(
          'w-64 shadow-lg h-[calc(100vh-64px)] z-40',
          'md:relative md:translate-x-0 md:top-0 md:left-0',
          'fixed top-16 left-0',
          'transform transition-transform duration-300 ease-in-out',
          isDarkMode ? 'bg-gray-800' : 'bg-white',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="mt-5 px-2">
          <Link
            to="/dashboard"
            className={className}
            onClick={() => toggle()}
          >
            Dashboard
          </Link>
          <Link
            to="/nutrition"
            className={className}
            onClick={() => toggle()}
          >
            Nutrition Tracking
          </Link>
          <Link
            to="/goals"
            className={className}
            onClick={() => toggle()}
          >
            Goals
          </Link>
          <Link
            to="/food-search"
            className={className}
            onClick={() => toggle()}
          >
            Food Search
          </Link>
        </nav>
      </div>
    </>
  );
} 