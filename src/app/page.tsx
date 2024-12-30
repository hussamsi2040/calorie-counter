'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { CameraIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import MainLayout from './components/Layout/MainLayout';
import ImageFoodLogger from './components/FoodLogging/ImageFoodLogger';
import TextFoodLogger from './components/FoodLogging/TextFoodLogger';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
            <Tab
              className={({ selected }: { selected: boolean }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center gap-2',
                  'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-900 hover:bg-white/[0.12] hover:text-indigo-600'
                )
              }
            >
              <CameraIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Photo</span>
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center gap-2',
                  'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-900 hover:bg-white/[0.12] hover:text-indigo-600'
                )
              }
            >
              <MicrophoneIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Text/Voice</span>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3 sm:p-4',
                'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none'
              )}
            >
              <ImageFoodLogger />
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3 sm:p-4',
                'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none'
              )}
            >
              <TextFoodLogger />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
    </div>
    </MainLayout>
  );
}
