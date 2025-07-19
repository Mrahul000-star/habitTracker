import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { CheckCircle, BarChart3, Calendar } from 'lucide-react';

function BottomNavigation() {
  const { state, actions } = useHabits();

  const navItems = [
    {
      id: 'habits',
      label: 'Habits',
      icon: CheckCircle,
      active: state.currentView === 'habits'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      active: state.currentView === 'progress'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      active: state.currentView === 'calendar'
    }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-6 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => actions.setView(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;

