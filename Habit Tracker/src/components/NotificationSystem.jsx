import React, { useState, useEffect } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { X, Clock, CheckCircle, Calendar, RotateCcw } from 'lucide-react';

function NotificationSystem() {
  const { state, actions } = useHabits();
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // Simulate habit reminder notifications
  const createHabitNotification = (habit) => {
    const notification = {
      id: Date.now().toString(),
      habitId: habit.id,
      habitName: habit.name,
      type: 'reminder',
      timestamp: new Date(),
      reminderTime: habit.reminderTime
    };

    setActiveNotifications(prev => [...prev, notification]);

    // Auto-remove after 30 seconds if no action taken
    setTimeout(() => {
      setActiveNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
    }, 30000);

    return notification;
  };

  // Handle notification actions
  const handleNotificationAction = (notificationId, habitId, action) => {
    // Remove the notification
    setActiveNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );

    switch (action) {
      case 'done':
        actions.markHabitDone(habitId);
        break;
      case 'postpone':
        actions.postponeHabit(habitId);
        break;
      case 'remind_later':
        // Schedule another notification in 10 minutes (simulated)
        setTimeout(() => {
          const habit = state.habits.find(h => h.id === habitId);
          if (habit) {
            createHabitNotification(habit);
          }
        }, 10 * 60 * 1000); // 10 minutes
        break;
    }
  };

  // Simulate notifications for testing
  const simulateNotification = () => {
    if (state.habits.length > 0) {
      const randomHabit = state.habits[Math.floor(Math.random() * state.habits.length)];
      createHabitNotification(randomHabit);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      {/* Notification Permission Banner */}
      {notificationPermission === 'default' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-blue-600">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Enable Notifications</h4>
                <p className="text-sm text-blue-700">Get reminders for your habits at the right time</p>
              </div>
            </div>
            <Button
              onClick={requestNotificationPermission}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enable
            </Button>
          </div>
        </div>
      )}

      {/* Test Notification Button (for demo purposes) */}
      {state.habits.length > 0 && (
        <div className="mb-4">
          <Button
            onClick={simulateNotification}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Clock size={16} className="mr-2" />
            Simulate Habit Reminder (Demo)
          </Button>
        </div>
      )}

      {/* Active Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {activeNotifications.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onAction={handleNotificationAction}
          />
        ))}
      </div>
    </>
  );
}

function NotificationCard({ notification, onAction }) {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-in slide-in-from-right">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600">
            <Clock size={16} />
          </div>
          <span className="text-sm font-medium text-gray-900">Habit Reminder</span>
        </div>
        <button
          onClick={() => onAction(notification.id, notification.habitId, 'dismiss')}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-1">{notification.habitName}</h4>
        <p className="text-sm text-gray-600">
          Scheduled for {formatTime(notification.reminderTime)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={() => onAction(notification.id, notification.habitId, 'done')}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle size={16} className="mr-2" />
          Mark as Done
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onAction(notification.id, notification.habitId, 'remind_later')}
            variant="outline"
            size="sm"
          >
            <RotateCcw size={14} className="mr-1" />
            Remind Later
          </Button>
          <Button
            onClick={() => onAction(notification.id, notification.habitId, 'postpone')}
            variant="outline"
            size="sm"
          >
            <Calendar size={14} className="mr-1" />
            Postpone
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotificationSystem;

