import React from 'react';
import { HabitProvider } from './contexts/HabitContext';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  return (
    <HabitProvider>
      <div className="min-h-screen bg-gray-50">
        <MainLayout />
      </div>
    </HabitProvider>
  );
}

export default App;
