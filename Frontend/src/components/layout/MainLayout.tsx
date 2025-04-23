import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { PropsWithChildren } from 'react';

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-100">
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