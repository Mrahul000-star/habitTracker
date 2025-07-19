import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { ArrowLeft, Calendar, Clock, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function HabitProgressDetail() {
  const { state, actions } = useHabits();
  const habit = state.selectedHabit;

  if (!habit) {
    return null;
  }

  // Calculate progress statistics
  const calculateStats = () => {
    const history = habit.completionHistory || [];
    const completed = history.filter(entry => entry.status === 'completed').length;
    const postponed = history.filter(entry => entry.status === 'postponed').length;
    const missed = history.filter(entry => entry.status === 'missed').length;
    const total = Math.max(history.length, 1);
    
    return {
      completed,
      postponed,
      missed,
      total,
      completionRate: Math.round((completed / total) * 100)
    };
  };

  const stats = calculateStats();
  const startDate = new Date(habit.startDate);
  const daysSinceStart = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));

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

  // Get weekly progress for the current week
  const getWeeklyProgress = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const weekDays = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      
      const dayString = day.toDateString();
      const completion = habit.completionHistory?.find(
        entry => new Date(entry.date).toDateString() === dayString
      );
      
      weekDays.push({
        day: dayNames[i],
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

  // Data for the pie chart
  const chartData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Postponed', value: stats.postponed, color: '#f59e0b' },
    { name: 'Missed', value: stats.missed, color: '#ef4444' },
    { name: 'Remaining', value: Math.max(0, habit.duration - stats.total), color: '#e5e7eb' }
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => actions.selectHabit(null)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{habit.name}</h1>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-600">Started {daysSinceStart} days ago</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target size={16} className="text-gray-400" />
            <span className="text-gray-600">{habit.duration} day goal</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-600">{formatTime(habit.reminderTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-600">{getDaysText(habit.selectedDays)}</span>
          </div>
        </div>
      </div>

      {/* Circular Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900">{stats.completionRate}%</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-600">{stats.postponed}</div>
              <div className="text-xs text-gray-500">Postponed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">{stats.missed}</div>
              <div className="text-xs text-gray-500">Missed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-2">{day.day}</div>
              <div
                className={`w-8 h-8 rounded-full mx-auto ${getStatusColor(day.status)}`}
                title={`${day.day}: ${day.status}`}
              />
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Postponed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Missed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitProgressDetail;

