import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

function CalendarSection() {
  const { state } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get habit status for a specific date
  const getHabitStatusForDate = (date) => {
    if (!date) return [];
    
    const dateString = date.toDateString();
    const statuses = [];
    
    state.habits.forEach(habit => {
      const completion = habit.completionHistory?.find(
        entry => new Date(entry.date).toDateString() === dateString
      );
      
      if (completion) {
        statuses.push({
          habitId: habit.id,
          habitName: habit.name,
          status: completion.status
        });
      }
    });
    
    return statuses;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="p-6">
      {state.habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CalendarIcon size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits to track</h3>
          <p className="text-gray-500">Add some habits first to see them on the calendar!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => {
                const habitStatuses = getHabitStatusForDate(date);
                const today = isToday(date);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-2 border-b border-r border-gray-100 ${
                      today ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          today ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        {/* Habit Status Indicators */}
                        <div className="space-y-1">
                          {habitStatuses.slice(0, 3).map((habit, idx) => (
                            <div
                              key={idx}
                              className={`w-full h-1.5 rounded-full ${getStatusColor(habit.status)}`}
                              title={`${habit.habitName}: ${habit.status}`}
                            />
                          ))}
                          {habitStatuses.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{habitStatuses.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Postponed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Missed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded-full bg-gray-300"></div>
                <span className="text-gray-600">No data</span>
              </div>
            </div>
          </div>

          {/* Habit Summary */}
          {state.habits.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Active Habits</h3>
              <div className="space-y-2">
                {state.habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{habit.name}</span>
                    <span className="text-gray-500">
                      {habit.completionHistory?.filter(h => h.status === 'completed').length || 0} completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarSection;

