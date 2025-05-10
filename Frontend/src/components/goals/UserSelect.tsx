import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useAuth0 } from '@auth0/auth0-react';
import type { Auth0User } from '@/types/auth0';
import { useGetUsersUsersGet } from '@/api/generated/fastAPI';
import { useGetTrainerUsersTrainerTrainerIdUsersGet } from '@/api/generated/fastAPI';

interface UserSelectProps {
  onSelect: (user: Auth0User) => void;
  selectedUserId: string;
}

export function UserSelect({ onSelect, selectedUserId }: UserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useTheme();
  const { user } = useAuth0();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: potentialUsers = [], isLoading: isSearching, error } = useGetUsersUsersGet({
    search_query: searchQuery.length >= 3 ? searchQuery : undefined
  });
  const { data: trainees = [] } = useGetTrainerUsersTrainerTrainerIdUsersGet(user?.sub || '', {
    status: 'active',
  });

  const activeTraineeIds = trainees.map(trainee => trainee.user_id);

  const filteredUsers = (potentialUsers as unknown as Auth0User[])
    .filter(potentialUser => 
      potentialUser.user_id === user?.sub || activeTraineeIds.includes(potentialUser.user_id)
    )
    .sort((a, b) => {
      // Put current user first
      if (a.user_id === user?.sub) return -1;
      if (b.user_id === user?.sub) return 1;
      // Then sort by name
      return a.name.localeCompare(b.name);
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUser = (potentialUsers as unknown as Auth0User[]).find(u => u.user_id === selectedUserId) || user;
  const isCurrentUser = selectedUser?.user_id === user?.sub;

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
        <div className="flex items-center space-x-3">
          <UserAvatar
            name={selectedUser?.name || 'Select User'}
            picture={selectedUser?.picture}
            size="sm"
          />
          <span>{selectedUser?.name}{isCurrentUser ? ' (You)' : ''}</span>
        </div>
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
              placeholder="Search for a user..."
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
                <LoadingSpinner size="md" />
              </div>
            ) : error ? (
              <div className={cn(
                "px-4 py-2 text-center",
                isDarkMode ? "text-red-400" : "text-red-500"
              )}>
                Error loading users
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((potentialUser) => {
                const isCurrentUser = potentialUser.user_id === user?.sub;
                const isSelected = potentialUser.user_id === selectedUserId;
                return (
                  <button
                    key={potentialUser.user_id}
                    onClick={() => {
                      onSelect(potentialUser);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer",
                      isDarkMode && "hover:bg-gray-700",
                      isDarkMode ? "text-gray-300" : "text-gray-900",
                      isSelected && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        name={potentialUser.name}
                        picture={potentialUser.picture}
                        size="md"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="font-medium">
                            {potentialUser.name}
                            {isCurrentUser ? ' (You)' : ''}
                          </p>
                          <p className={cn(
                            "text-sm",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>{potentialUser.email}</p>
                        </div>
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
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