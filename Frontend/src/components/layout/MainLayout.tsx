import { Outlet } from '@tanstack/react-router';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { PropsWithChildren } from 'react';

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 