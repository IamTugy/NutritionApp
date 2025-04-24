import { useAuth0 } from '@auth0/auth0-react';
import { useFloating, useInteractions, useClick, useDismiss, useRole, useId } from '@floating-ui/react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';

export function UserMenu() {
  const { user, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const headingId = useId();

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex items-center space-x-2 focus:outline-none cursor-pointer"
      >
        <img
          src={user?.picture}
          alt={user?.name || 'User'}
          className="h-8 w-8 rounded-full"
        />
      </button>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          aria-labelledby={headingId}
          {...getFloatingProps()}
          className={cn(
            "z-10 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg",
            isDarkMode && "bg-gray-800 border-gray-700"
          )}
        >
          <div className={cn(
            "px-4 py-2 text-sm text-gray-700 border-b border-gray-300",
            isDarkMode && "text-gray-300 border-gray-700"
          )}>
            <p className="font-medium">{user?.name}</p>
            <p className={cn(
              "text-gray-500",
              isDarkMode && "text-gray-400"
            )}>{user?.email}</p>
          </div>
          <button
            onClick={toggleTheme}
            className={cn(
              "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center space-x-2",
              isDarkMode && "text-gray-300 hover:bg-gray-700"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {isDarkMode ? (
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              ) : (
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              )}
            </svg>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className={cn(
              "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer",
              isDarkMode && "text-gray-300 hover:bg-gray-700"
            )}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
} 