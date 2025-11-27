import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Routine } from '../types';
import { supabase } from '../lib/supabase';

interface RoutineContextType {
    routines: Routine[];
    addRoutine: (routine: Routine) => Promise<void>;
    updateRoutine: (routine: Routine) => Promise<void>;
    loading: boolean;
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
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            const { data, error } = await supabase
                .from('routines')
                .select('*, exercises(*)');

            if (error) throw error;

            if (data) {
                // Map DB snake_case to camelCase if needed, but here we kept names mostly same.
                // However, DB 'bg_color' needs to map to 'bgColor'.
                const formattedRoutines: Routine[] = data.map((r: any) => ({
                    ...r,
                    bgColor: r.bg_color,
                    exercises: r.exercises
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((e: any) => ({
                            ...e,
                            reps: typeof e.reps === 'string' ? JSON.parse(e.reps) : e.reps
                        }))
                }));
                setRoutines(formattedRoutines);
            }
        } catch (error) {
            console.error('Error fetching routines:', error);
        } finally {
            setLoading(false);
        }
    };

    const addRoutine = async (routine: Routine) => {
        try {
            // 1. Insert Routine
            const { data: routineData, error: routineError } = await supabase
                .from('routines')
                .insert({
                    name: routine.name,
                    details: routine.details,
                    icon: routine.icon,
                    color: routine.color,
                    bg_color: routine.bgColor
                })
                .select()
                .single();

            if (routineError) throw routineError;

            if (routine.exercises.length > 0) {
                // 2. Insert Exercises
                const exercisesToInsert = routine.exercises.map((ex, index) => ({
                    routine_id: routineData.id,
                    name: ex.name,
                    sets: ex.sets,
                    reps: JSON.stringify(ex.reps),
                    order_index: index
                }));

                const { error: exercisesError } = await supabase
                    .from('exercises')
                    .insert(exercisesToInsert);

                if (exercisesError) throw exercisesError;
            }

            // Refresh local state
            await fetchRoutines();
        } catch (error) {
            console.error('Error adding routine:', error);
            alert('Failed to save routine');
        }
    };

    const updateRoutine = async (routine: Routine) => {
        try {
            // 1. Update Routine Details
            const { error: routineError } = await supabase
                .from('routines')
                .update({
                    name: routine.name,
                    details: routine.details,
                    icon: routine.icon,
                    color: routine.color,
                    bg_color: routine.bgColor
                })
                .eq('id', routine.id);

            if (routineError) throw routineError;

            // 2. Handle Exercises
            // Get existing exercises for this routine to know what to delete
            const { data: existingExercises, error: fetchError } = await supabase
                .from('exercises')
                .select('id')
                .eq('routine_id', routine.id);

            if (fetchError) throw fetchError;

            const existingIds = existingExercises?.map(e => e.id) || [];
            const incomingIds = routine.exercises.map(e => e.id).filter(id => existingIds.includes(id));

            // Identify IDs to delete (existing but not in incoming)
            const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));

            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('exercises')
                    .delete()
                    .in('id', idsToDelete);
                if (deleteError) throw deleteError;
            }

            // Upsert exercises (update existing, insert new)
            const exercisesToUpsert = routine.exercises.map((ex, index) => ({
                id: ex.id,
                routine_id: routine.id,
                name: ex.name,
                sets: ex.sets,
                reps: JSON.stringify(ex.reps),
                order_index: index
            }));

            const { error: upsertError } = await supabase
                .from('exercises')
                .upsert(exercisesToUpsert);

            if (upsertError) throw upsertError;

            // Refresh local state
            await fetchRoutines();
        } catch (error) {
            console.error('Error updating routine:', error);
            alert('Failed to update routine');
        }
    };

    return (
        <RoutineContext.Provider value={{ routines, addRoutine, updateRoutine, loading }}>
            {children}
        </RoutineContext.Provider>
    );
};
