import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Clock } from 'lucide-react';

function HabitCard({ habit }) {
  const { actions } = useHabits();
  const [showMenu, setShowMenu] = useState(false);

  // Calculate progress for the current week
  const getWeeklyProgress = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      
      const dayString = day.toDateString();
      const completion = habit.completionHistory?.find(
        entry => new Date(entry.date).toDateString() === dayString
      );
      
      weekDays.push({
        date: day,
        status: completion?.status || 'pending'
      });
    }
    
    return weekDays;
  };

  const weeklyProgress = getWeeklyProgress();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'postponed':
        return 'bg-yellow-500';
      case 'missed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysText = (selectedDays) => {
    if (selectedDays.length === 7) return 'Every day';
    if (selectedDays.length === 5 && !selectedDays.includes(0) && !selectedDays.includes(6)) {
      return 'Weekdays';
    }
    if (selectedDays.length === 2 && selectedDays.includes(0) && selectedDays.includes(6)) {
      return 'Weekends';
    }
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return selectedDays.map(day => dayNames[day]).join(', ');
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative">
      {/* Menu Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical size={16} className="text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-10 right-3 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={() => {
              // TODO: Implement edit functionality
              setShowMenu(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            <Edit size={14} className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              actions.deleteHabit(habit.id);
              setShowMenu(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
        </div>
      )}

      {/* Habit Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{habit.name}</h3>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {formatTime(habit.reminderTime)}
          </div>
          <span>{getDaysText(habit.selectedDays)}</span>
        </div>
      </div>

      {/* Weekly Progress Dots */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">This week</span>
        <div className="flex space-x-2">
          {weeklyProgress.map((day, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${getStatusColor(day.status)}`}
              title={day.date.toLocaleDateString()}
            />
          ))}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}

export default HabitCard;

