import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  habits: [],
  currentView: 'habits', // 'habits', 'progress', 'calendar'
  selectedHabit: null,
  notifications: []
};

// Action types
const ACTIONS = {
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  SET_VIEW: 'SET_VIEW',
  SELECT_HABIT: 'SELECT_HABIT',
  MARK_HABIT_DONE: 'MARK_HABIT_DONE',
  POSTPONE_HABIT: 'POSTPONE_HABIT',
  LOAD_HABITS: 'LOAD_HABITS'
};

// Reducer function
function habitReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_HABIT:
      return {
        ...state,
        habits: [...state.habits, { ...action.payload, id: Date.now().toString() }]
      };
    
    case ACTIONS.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? { ...habit, ...action.payload } : habit
        )
      };
    
    case ACTIONS.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        selectedHabit: state.selectedHabit?.id === action.payload ? null : state.selectedHabit
      };
    
    case ACTIONS.SET_VIEW:
      return {
        ...state,
        currentView: action.payload
      };
    
    case ACTIONS.SELECT_HABIT:
      return {
        ...state,
        selectedHabit: action.payload
      };
    
    case ACTIONS.MARK_HABIT_DONE:
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id === action.payload.habitId) {
            const today = new Date().toDateString();
            const updatedHistory = habit.completionHistory || [];
            const existingEntry = updatedHistory.find(entry => 
              new Date(entry.date).toDateString() === today
            );
            
            if (existingEntry) {
              existingEntry.status = 'completed';
            } else {
              updatedHistory.push({
                date: new Date(),
                status: 'completed'
              });
            }
            
            return {
              ...habit,
              completionHistory: updatedHistory
            };
          }
          return habit;
        })
      };
    
    case ACTIONS.POSTPONE_HABIT:
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id === action.payload.habitId) {
            const today = new Date().toDateString();
            const updatedHistory = habit.completionHistory || [];
            const existingEntry = updatedHistory.find(entry => 
              new Date(entry.date).toDateString() === today
            );
            
            if (existingEntry) {
              existingEntry.status = 'postponed';
            } else {
              updatedHistory.push({
                date: new Date(),
                status: 'postponed'
              });
            }
            
            return {
              ...habit,
              completionHistory: updatedHistory
            };
          }
          return habit;
        })
      };
    
    case ACTIONS.LOAD_HABITS:
      return {
        ...state,
        habits: action.payload
      };
    
    default:
      return state;
  }
}

// Create context
const HabitContext = createContext();

// Context provider component
export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      try {
        const parsedHabits = JSON.parse(savedHabits);
        dispatch({ type: ACTIONS.LOAD_HABITS, payload: parsedHabits });
      } catch (error) {
        console.error('Error loading habits from localStorage:', error);
      }
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(state.habits));
  }, [state.habits]);

  // Action creators
  const actions = {
    addHabit: (habit) => dispatch({ type: ACTIONS.ADD_HABIT, payload: habit }),
    updateHabit: (habit) => dispatch({ type: ACTIONS.UPDATE_HABIT, payload: habit }),
    deleteHabit: (habitId) => dispatch({ type: ACTIONS.DELETE_HABIT, payload: habitId }),
    setView: (view) => dispatch({ type: ACTIONS.SET_VIEW, payload: view }),
    selectHabit: (habit) => dispatch({ type: ACTIONS.SELECT_HABIT, payload: habit }),
    markHabitDone: (habitId) => dispatch({ type: ACTIONS.MARK_HABIT_DONE, payload: { habitId } }),
    postponeHabit: (habitId) => dispatch({ type: ACTIONS.POSTPONE_HABIT, payload: { habitId } })
  };

  return (
    <HabitContext.Provider value={{ state, actions }}>
      {children}
    </HabitContext.Provider>
  );
}

// Custom hook to use the context
export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}

export { ACTIONS };

