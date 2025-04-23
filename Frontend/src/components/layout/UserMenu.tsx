import { useAuth0 } from '@auth0/auth0-react';
import { useFloating, useInteractions, useClick, useDismiss, useRole, useId } from '@floating-ui/react';
import { useState } from 'react';

export function UserMenu() {
  const { user, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

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
          className="mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg"
        >
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
            <p className="font-medium">{user?.name}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="size-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
} 