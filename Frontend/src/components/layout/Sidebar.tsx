import { Link } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/utils/tw';
import { useEffect, useRef } from 'react';

export function Sidebar() {
  const { isAuthenticated } = useAuth0();
  const { isOpen, toggle } = useSidebar();
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

  const className = 'group flex items-center p-2 text-base font-medium rounded-md [&.active]:bg-gray-100 [&.active]:text-gray-900 text-gray-600 hover:bg-gray-50 hover:text-gray-900';

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
          'w-64 bg-white shadow-lg h-[calc(100vh-64px)] z-40',
          'md:relative md:translate-x-0 md:top-0 md:left-0',
          'fixed top-16 left-0',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="mt-5 px-2">
          <Link
            to="/dashboard"
            className={className}
          >
            Dashboard
          </Link>
          <Link
            to="/nutrition"
            className={className}
          >
            Nutrition Tracking
          </Link>
          <Link
            to="/goals"
            className={className}
          >
            Goals
          </Link>
          <Link
            to="/food-search"
            className={className}
          >
            Food Search
          </Link>
        </nav>
      </div>
    </>
  );
} 