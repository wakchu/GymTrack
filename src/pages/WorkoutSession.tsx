import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const WorkoutSession: React.FC = () => {
    const navigate = useNavigate();
    const [isResting, setIsResting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90); // 1:30 default rest

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isResting && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsResting(false);
            setTimeLeft(90); // Reset for next time
        }
        return () => clearInterval(interval);
    }, [isResting, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCompleteSet = () => {
        setIsResting(true);
        setTimeLeft(90);
    };

    const handleSkipRest = () => {
        setIsResting(false);
    };

    return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col p-4 relative">
            {/* Header */}
            <div className="flex items-center pb-2">
                <button onClick={() => navigate(-1)} className="flex items-center justify-start w-12">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold flex-1 text-center">Push Day</h2>
                <button className="w-auto text-primary font-bold" onClick={() => navigate('/')}>
                    End Workout
                </button>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-2 pt-4 pb-6">
                <div className="flex justify-between text-sm font-medium">
                    <span>Overall Progress</span>
                </div>
                <div className="rounded bg-[#1C1C1E] h-2 w-full">
                    <div className="h-full rounded bg-primary" style={{ width: '38%' }} />
                </div>
                <p className="text-primary/80 text-sm">Exercise 3 of 8</p>
            </div>

            {/* Main Card */}
            <div className="flex flex-col gap-6 rounded-xl bg-[#1C1C1E] p-6 flex-1">
                <h1 className="text-3xl font-bold text-center tracking-tight">BENCH PRESS</h1>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[140px] flex flex-col items-center gap-2 rounded-lg border border-white/10 p-4">
                        <p className="text-base font-medium">Weight</p>
                        <p className="text-2xl font-bold">80 kg</p>
                    </div>
                    <div className="flex-1 min-w-[140px] flex flex-col items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 p-4">
                        <p className="text-base font-medium text-primary">Reps</p>
                        <p className="text-5xl font-bold text-primary">10</p>
                    </div>
                    <div className="flex-1 min-w-[140px] flex flex-col items-center gap-2 rounded-lg border border-white/10 p-4">
                        <p className="text-base font-medium">Set</p>
                        <p className="text-2xl font-bold">2/4</p>
                    </div>
                </div>

                <div className="flex-grow" />

                <div className="flex flex-col gap-4 pt-8 pb-4">
                    <Button variant="secondary" className="h-14 bg-white/10 hover:bg-white/20">
                        Next Exercise
                    </Button>
                    <Button className="h-16 text-lg text-black" onClick={handleCompleteSet}>
                        Complete Set
                    </Button>
                </div>
            </div>

            {/* Rest Timer Overlay */}
            {isResting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm z-50">
                    <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-xl bg-[#1C1C1E] p-8 border border-white/10">
                        <h2 className="text-xl font-bold">REST</h2>
                        <div className="flex items-end justify-center gap-1 text-primary">
                            <p className="text-7xl font-bold leading-none tracking-tighter">
                                {formatTime(timeLeft).split(':')[0]}
                            </p>
                            <p className="pb-2 text-4xl font-bold leading-none opacity-70">:</p>
                            <p className="text-7xl font-bold leading-none tracking-tighter">
                                {formatTime(timeLeft).split(':')[1]}
                            </p>
                        </div>
                        <Button
                            className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                            onClick={handleSkipRest}
                        >
                            Skip Rest
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
