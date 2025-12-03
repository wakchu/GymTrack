import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useRoutines } from '../context/RoutineContext';
import { supabase } from '../lib/supabase';

export const WorkoutSession: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { routines } = useRoutines();

    // State
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
    const [sessionLogs, setSessionLogs] = useState<any[]>([]);


    // Input State
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    const routine = routines.find(r => r.id === id);
    const currentExercise = routine?.exercises[currentExerciseIndex];

    useEffect(() => {
        if (!routine) {
            // Wait for routines to load or redirect if not found
            // For now, we assume routines might be loading, but if empty and not loading, redirect
            // Ideally we check 'loading' from context
        }
    }, [routine]);



    // Initialize inputs when exercise or set changes
    // Initialize inputs when exercise changes
    useEffect(() => {
        if (currentExercise) {
            const setsDone = completedSets[currentExercise.id] || 0;
            const nextSet = setsDone + 1;

            // Pre-fill reps if available from target
            const targetReps = Array.isArray(currentExercise.reps)
                ? currentExercise.reps[nextSet - 1] || currentExercise.reps[0]
                : '';
            setReps(targetReps);
            // Keep weight from previous set or clear? Let's keep it if it's not the first set
            if (nextSet === 1) setWeight('');
        }
    }, [currentExercise, completedSets]);



    const handleCompleteSet = async () => {
        if (!currentExercise || !routine) return;

        const setsDone = completedSets[currentExercise.id] || 0;
        const currentSetNumber = setsDone + 1;
        const totalSets = Number(currentExercise.sets) || 3;
        const isLastExercise = currentExerciseIndex === routine.exercises.length - 1;
        const isLastSet = currentSetNumber >= totalSets;

        try {
            // Save log to Supabase
            const { data: newLog, error } = await supabase
                .from('workout_logs')
                .insert({
                    routine_id: routine.id,
                    exercise_id: currentExercise.id,
                    weight: Number(weight) || 0,
                    reps: Number(reps) || 0,
                    set_number: currentSetNumber
                })
                .select()
                .single();

            if (error) throw error;

            // Update local progress
            setCompletedSets(prev => ({
                ...prev,
                [currentExercise.id]: (prev[currentExercise.id] || 0) + 1
            }));

            // Add to session logs
            if (newLog) {
                setSessionLogs(prev => [...prev, newLog]);
            }

            if (isLastSet && isLastExercise) {
                alert('Workout Complete!');
                navigate('/');
                return;
            }

            // Logic to move to next set or exercise
            if (currentSetNumber < totalSets) {
                // Stay on current exercise for next set
            } else {
                // Exercise Complete
                if (currentExerciseIndex < routine.exercises.length - 1) {
                    // Next Exercise
                    setCurrentExerciseIndex(prev => prev + 1);
                }
            }
        } catch (err) {
            console.error('Error logging set:', err);
            alert('Failed to save set. Please try again.');
        }
    };

    const handleFinish = () => {
        if (!routine) return;

        // Check if all exercises are completed
        const allCompleted = routine.exercises.every(ex => {
            const setsDone = completedSets[ex.id] || 0;
            const totalSets = Number(ex.sets) || 0;
            return setsDone >= totalSets;
        });

        if (!allCompleted) {
            alert('Please complete all sets for all exercises before finishing.');
            return;
        }

        alert('Workout Complete!');
        navigate('/');
    };

    const prevExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
        }
    };

    const nextExercise = () => {
        if (routine && currentExerciseIndex < routine.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        }
    };



    if (!routine || !currentExercise) {
        return <div className="min-h-screen bg-background-dark text-white p-4">Loading or Routine Not Found...</div>;
    }

    const totalSets = Number(currentExercise.sets) || 0;
    const setsDone = completedSets[currentExercise.id] || 0;
    const isLastSet = setsDone + 1 >= totalSets;
    const isLastExercise = currentExerciseIndex === routine.exercises.length - 1;

    // Filter logs for current exercise
    const currentExerciseLogs = sessionLogs.filter(log => log.exercise_id === currentExercise.id);

    return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col p-4 relative">
            {/* Header */}
            <div className="flex items-center pb-2">
                <button onClick={() => navigate(-1)} className="flex items-center justify-start w-12">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold flex-1 text-center">{routine.name}</h2>
                <button className="w-auto text-primary font-bold" onClick={handleFinish}>
                    Finish
                </button>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-2 pt-4 pb-6">
                <div className="flex justify-between text-sm font-medium">
                    <span>Overall Progress</span>
                </div>
                <div className="rounded bg-[#1C1C1E] h-2 w-full">
                    <div
                        className="h-full rounded bg-primary transition-all duration-300"
                        style={{ width: `${((currentExerciseIndex) / routine.exercises.length) * 100}%` }}
                    />
                </div>
                <p className="text-primary/80 text-sm">
                    Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
                </p>
            </div>

            {/* Main Card */}
            <div className="flex flex-col gap-6 rounded-xl bg-[#1C1C1E] p-6 flex-1">
                <div className="flex items-center justify-between">
                    <button
                        onClick={prevExercise}
                        disabled={currentExerciseIndex === 0}
                        className="p-2 disabled:opacity-30"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <h1 className="text-3xl font-bold text-center tracking-tight uppercase flex-1">{currentExercise.name}</h1>
                    <button
                        onClick={nextExercise}
                        disabled={!routine || currentExerciseIndex === routine.exercises.length - 1}
                        className="p-2 disabled:opacity-30"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[140px] flex flex-col items-center gap-2 rounded-lg border border-white/10 p-4">
                        <p className="text-base font-medium">Weight (kg)</p>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="0"
                            className="text-2xl font-bold bg-transparent text-center w-full outline-none text-white placeholder-white/20"
                        />
                    </div>
                    <div className="flex-1 min-w-[140px] flex flex-col items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 p-4">
                        <p className="text-base font-medium text-primary">Reps</p>
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            placeholder="0"
                            className="text-5xl font-bold text-primary bg-transparent text-center w-full outline-none placeholder-primary/20"
                        />
                    </div>
                    <div className="flex-1 min-w-[140px] flex flex-col items-center gap-2 rounded-lg border border-white/10 p-4">
                        <p className="text-base font-medium">Set</p>
                        <p className="text-2xl font-bold">{(completedSets[currentExercise.id] || 0) + 1}/{totalSets}</p>
                    </div>
                </div>

                <div className="flex-grow" />

                <div className="flex flex-col gap-4 pt-8 pb-4">
                    {/* Session History */}
                    {currentExerciseLogs.length > 0 && (
                        <div className="bg-black/20 rounded-lg p-4 mb-4">
                            <h3 className="text-sm font-medium text-white/60 mb-2">Current Session</h3>
                            <div className="space-y-2">
                                {currentExerciseLogs.map((log, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-white">Set {log.set_number}</span>
                                        <span className="text-primary">{log.weight}kg x {log.reps}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        className={`h-16 text-lg ${isLastSet && isLastExercise ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-black'}`}
                        onClick={handleCompleteSet}
                    >
                        {isLastSet && isLastExercise ? 'Save Routine' : 'Complete Set'}
                    </Button>
                </div>
            </div>


        </div>
    );
};
