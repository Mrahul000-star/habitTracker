import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import HabitsSection from './HabitsSection';
import ProgressSection from './ProgressSection';
import CalendarSection from './CalendarSection';
import BottomNavigation from './BottomNavigation';
import NotificationSystem from './NotificationSystem';

function MainLayout() {
  const { state } = useHabits();

  const renderCurrentSection = () => {
    switch (state.currentView) {
      case 'habits':
        return <HabitsSection />;
      case 'progress':
        return <ProgressSection />;
      case 'calendar':
        return <CalendarSection />;
      default:
        return <HabitsSection />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          {state.currentView === 'habits' && 'My Habits'}
          {state.currentView === 'progress' && 'Progress'}
          {state.currentView === 'calendar' && 'Calendar'}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderCurrentSection()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}

export default MainLayout;

