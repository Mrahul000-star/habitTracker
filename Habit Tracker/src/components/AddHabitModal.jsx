import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function AddHabitModal({ isOpen, onClose }) {
  const { actions } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    duration: 30, // days
    reminderTime: '09:00',
    selectedDays: [1, 2, 3, 4, 5] // Monday to Friday by default
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    if (formData.selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    const newHabit = {
      ...formData,
      startDate: new Date(),
      isActive: true,
      completionHistory: []
    };

    actions.addHabit(newHabit);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      duration: 30,
      reminderTime: '09:00',
      selectedDays: [1, 2, 3, 4, 5]
    });
  };

  const toggleDay = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayIndex)
        ? prev.selectedDays.filter(day => day !== dayIndex)
        : [...prev.selectedDays, dayIndex].sort()
    }));
  };

  const selectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      selectedDays: [0, 1, 2, 3, 4, 5, 6]
    }));
  };

  const selectWeekdays = () => {
    setFormData(prev => ({
      ...prev,
      selectedDays: [1, 2, 3, 4, 5]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Habit</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Morning Exercise, Read 30 minutes"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Duration (days)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Time
            </label>
            <input
              type="time"
              value={formData.reminderTime}
              onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={false}
            />
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Days
            </label>
            
            {/* Quick Select Buttons */}
            <div className="flex space-x-2 mb-3">
              <Button
                type="button"
                onClick={selectAllDays}
                variant="outline"
                size="sm"
              >
                Every Day
              </Button>
              <Button
                type="button"
                onClick={selectWeekdays}
                variant="outline"
                size="sm"
              >
                Weekdays
              </Button>
            </div>

            {/* Day Buttons */}
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`py-2 px-1 text-sm rounded-lg border transition-colors ${
                    formData.selectedDays.includes(index)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Habit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHabitModal;

