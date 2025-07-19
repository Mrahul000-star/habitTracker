import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import HabitProgressDetail from './HabitProgressDetail';

function ProgressSection() {
  const { state, actions } = useHabits();

  if (state.selectedHabit) {
    return <HabitProgressDetail />;
  }

  return (
    <div className="p-6">
      {state.habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TrendingUp size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits to track</h3>
          <p className="text-gray-500">Add some habits first to see your progress!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Habits</h2>
          {state.habits.map((habit) => (
            <HabitProgressCard 
              key={habit.id} 
              habit={habit} 
              onSelect={() => actions.selectHabit(habit)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HabitProgressCard({ habit, onSelect }) {
  // Calculate completion percentage
  const calculateProgress = () => {
    if (!habit.completionHistory || habit.completionHistory.length === 0) {
      return 0;
    }

    const completedDays = habit.completionHistory.filter(
      entry => entry.status === 'completed'
    ).length;

    const totalDays = Math.min(habit.completionHistory.length, habit.duration);
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  };

  const progress = calculateProgress();
  const startDate = new Date(habit.startDate);
  const daysSinceStart = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{habit.name}</h3>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Started {daysSinceStart} days ago</p>
            <p>Reminder: {formatTime(habit.reminderTime)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          
          {/* Simple progress circle */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressSection;

