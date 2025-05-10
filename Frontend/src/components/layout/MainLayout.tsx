import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { PropsWithChildren } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';

export function MainLayout({ children }: PropsWithChildren) {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      isDarkMode && "bg-gray-900"
    )}>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
} 