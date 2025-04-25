import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useAuth0Users } from '@/hooks/useAuth0Users';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useAuth0 } from '@auth0/auth0-react';

interface Auth0User {
  user_id: string;
  email: string;
  name: string;
  picture?: string;
}

interface TrainerSelectProps {
  onSelect: (trainer: Auth0User) => void;
  isAlreadyTrainer: (userId: string) => boolean;
}

export function TrainerSelect({ onSelect, isAlreadyTrainer }: TrainerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useTheme();
  const { user } = useAuth0();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: potentialTrainers = [], isLoading: isSearching, error } = useAuth0Users(searchQuery);

  const filteredTrainers = potentialTrainers.filter(trainer => trainer.user_id !== user?.sub);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between px-4 py-2 rounded-lg border cursor-pointer w-80",
          isDarkMode 
            ? "bg-gray-800 border-gray-700 text-white" 
            : "bg-white border-gray-300 text-gray-900"
        )}
      >
        <span>Add a trainer</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "h-5 w-5 transition-transform",
            isOpen && "transform rotate-180"
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-10 w-full mt-1 rounded-lg border shadow-lg",
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-300"
        )}>
          <div className="p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a trainer..."
              className={cn(
                "w-full p-2 rounded-md border",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              )}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center p-4">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className={cn(
                "px-4 py-2 text-center",
                isDarkMode ? "text-red-400" : "text-red-500"
              )}>
                Error loading users
              </div>
            ) : filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => {
                const isTrainer = isAlreadyTrainer(trainer.user_id);
                return (
                  <button
                    key={trainer.user_id}
                    onClick={() => {
                      onSelect(trainer);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    disabled={isTrainer}
                    className={cn(
                      "w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer",
                      isDarkMode && "hover:bg-gray-700",
                      isTrainer && "opacity-50 cursor-not-allowed",
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        name={trainer.name}
                        picture={trainer.picture}
                        size="md"
                      />
                      <div>
                        <p className="font-medium">{trainer.name}</p>
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>{trainer.email}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className={cn(
                "px-4 py-2 text-center",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                No users found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 