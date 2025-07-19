import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';

function HabitsSection() {
  const { state } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6 space-y-4">
      {/* Habit List */}
      <div className="space-y-3">
        {state.habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CheckCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-500 mb-6">Start building better habits today!</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              Add Your First Habit
            </Button>
          </div>
        ) : (
          <>
            {state.habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
            
            {/* Add New Habit Button */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
            >
              <Plus size={20} className="mr-2" />
              Add New Habit
            </Button>
          </>
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
}

export default HabitsSection;

