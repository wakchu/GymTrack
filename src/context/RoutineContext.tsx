import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Routine } from '../types';

interface RoutineContextType {
    routines: Routine[];
    addRoutine: (routine: Routine) => void;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const useRoutines = () => {
    const context = useContext(RoutineContext);
    if (!context) {
        throw new Error('useRoutines must be used within a RoutineProvider');
    }
    return context;
};

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [routines, setRoutines] = useState<Routine[]>(() => {
        const saved = localStorage.getItem('gym-tracker-routines');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            {
                id: '1',
                name: 'Push Day',
                details: '5 Exercises',
                exercises: [],
                icon: 'dumbbell',
                color: 'text-primary',
                bgColor: 'bg-primary/20',
            },
            {
                id: '2',
                name: 'Legs',
                details: '6 Exercises',
                exercises: [],
                icon: 'dumbbell',
                color: 'text-primary',
                bgColor: 'bg-primary/20',
            },
            {
                id: '3',
                name: 'Cardio Blast',
                details: '45 Mins',
                exercises: [],
                icon: 'person-standing',
                color: 'text-primary',
                bgColor: 'bg-primary/20',
            },
        ];
    });

    useEffect(() => {
        localStorage.setItem('gym-tracker-routines', JSON.stringify(routines));
    }, [routines]);

    const addRoutine = (routine: Routine) => {
        setRoutines((prev) => [...prev, routine]);
    };

    return (
        <RoutineContext.Provider value={{ routines, addRoutine }}>
            {children}
        </RoutineContext.Provider>
    );
};
