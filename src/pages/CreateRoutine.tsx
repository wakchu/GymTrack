import React, { useState } from 'react';
import { ArrowLeft, Trash2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import { useRoutines } from '../context/RoutineContext';
import type { Exercise } from '../types';

export const CreateRoutine: React.FC = () => {
    const navigate = useNavigate();
    const { addRoutine } = useRoutines();
    const [routineName, setRoutineName] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([
        { id: '1', name: '', sets: '', reps: '' }
    ]);

    const addExercise = () => {
        setExercises([
            ...exercises,
            { id: crypto.randomUUID(), name: '', sets: '', reps: '' }
        ]);
    };

    const removeExercise = (id: string) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    };

    const updateExercise = (id: string, field: keyof Exercise, value: string) => {
        setExercises(exercises.map(ex =>
            ex.id === id ? { ...ex, [field]: value } : ex
        ));
    };

    const handleSave = () => {
        if (!routineName.trim()) return;

        const newRoutine = {
            id: crypto.randomUUID(),
            name: routineName,
            exercises,
            details: `${exercises.length} Exercises`,
            icon: 'dumbbell',
            color: 'text-primary',
            bgColor: 'bg-primary/20',
        };

        addRoutine(newRoutine);
        navigate('/');
    };

    return (
        <Layout title="Create Routine">
            <div className="space-y-6 pb-24">
                <div className="flex items-center gap-4 md:hidden">
                    <button onClick={() => navigate(-1)} className="text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    {/* Title is in Layout header for mobile, but we might want a custom header here if Layout's is too generic. 
              Layout uses the title prop. */}
                </div>

                <div>
                    <Input
                        label="Routine Name"
                        placeholder="e.g., Leg Day Annihilation"
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white">Exercises</h2>

                    {exercises.map((exercise) => (
                        <div key={exercise.id} className="space-y-3 rounded-lg border border-[#222222] p-4 bg-[#1E1E1E]">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        label="Exercise Name"
                                        placeholder="e.g. Barbell Squat"
                                        value={exercise.name}
                                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="pt-8">
                                    <button
                                        onClick={() => removeExercise(exercise.id)}
                                        className="text-gray-500 hover:text-primary p-2 border border-[#222222] bg-[#222222] rounded-lg h-14 w-14 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        label="Sets"
                                        placeholder="4"
                                        value={exercise.sets}
                                        onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="Reps"
                                        placeholder="12"
                                        value={exercise.reps}
                                        onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full border-dashed border-primary/50 hover:bg-primary/10 py-6"
                        onClick={addExercise}
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Exercise
                    </Button>
                </div>

                <div className="sticky bottom-0 bg-background-dark p-4 -mx-4 border-t border-white/10 md:static md:border-0 md:p-0 md:mx-0">
                    <Button className="w-full py-6 text-lg text-black" onClick={handleSave}>
                        Save Routine
                    </Button>
                </div>
            </div>
        </Layout>
    );
};
