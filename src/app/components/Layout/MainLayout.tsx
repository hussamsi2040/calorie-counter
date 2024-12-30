import { ReactNode } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Smart Calorie Counter
              </h1>
            </div>
            <div className="flex items-center">
              <button className="inline-flex items-center bg-indigo-600 p-2 rounded-md text-white hover:bg-indigo-700 shadow-sm">
                <PlusIcon className="h-5 w-5" />
                <span className="hidden sm:ml-2 sm:block">Add Meal</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mt-14 sm:mt-16">
        {children}
      </main>
      <div className="h-16 sm:hidden">
        {/* Spacer for mobile to prevent content from being hidden behind bottom nav bars */}
      </div>
    </div>
  );
} 