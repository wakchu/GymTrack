import React from 'react';
import { ArrowLeft, MoreVertical, Dumbbell, ChevronRight, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const RoutineDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data - in a real app this would come from an API/store based on ID
    const routineName = "Push Day";
    const exercises = [
        { id: 1, name: 'Bench Press', details: '3 Sets x 10 Reps' },
        { id: 2, name: 'Incline Dumbbell Fly', details: '4 Sets x 12 Reps' },
        { id: 3, name: 'Overhead Press', details: '3 Sets x 8 Reps' },
        { id: 4, name: 'Tricep Pushdown', details: '3 Sets x 15 Reps' },
    ];

    return (
        <Layout title={routineName}>
            <div className="space-y-6 pb-24">
                <div className="flex items-center justify-between md:hidden">
                    <button onClick={() => navigate(-1)} className="text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    {/* Title handled by Layout on mobile, but we can override or just rely on it */}
                    <button className="text-white">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </div>

                {/* Chart Card */}
                <Card className="bg-black/20 border border-white/5">
                    <div className="space-y-2 mb-4">
                        <p className="text-white text-base font-medium">Strength Progress</p>
                        <p className="text-white text-3xl font-bold">150 kg</p>
                        <div className="flex gap-2 text-sm">
                            <span className="text-primary/70">Last 3 Months</span>
                            <span className="text-primary font-medium">+12%</span>
                        </div>
                    </div>

                    {/* Simple SVG Chart Placeholder */}
                    <div className="h-32 w-full">
                        <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#39FF14" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0 100 C 50 100, 50 40, 100 40 C 150 40, 150 80, 200 80 C 250 80, 250 20, 300 20 C 350 20, 350 60, 400 60 V 150 H 0 Z"
                                fill="url(#chartGradient)"
                            />
                            <path
                                d="M0 100 C 50 100, 50 40, 100 40 C 150 40, 150 80, 200 80 C 250 80, 250 20, 300 20 C 350 20, 350 60, 400 60"
                                fill="none"
                                stroke="#39FF14"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <div className="flex justify-between mt-4 text-primary/70 text-xs font-bold uppercase tracking-wider">
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                    </div>
                </Card>

                <Button className="w-full py-6 text-lg text-black" onClick={() => navigate(`/workout/${id}`)}>
                    <Play className="mr-2 w-5 h-5 fill-current" />
                    Start Workout
                </Button>

                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Exercises</h3>
                    <div className="space-y-2">
                        {exercises.map((exercise) => (
                            <div
                                key={exercise.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-black/20 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => navigate(`/exercise/${exercise.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                                        <Dumbbell className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium line-clamp-1">{exercise.name}</p>
                                        <p className="text-white/60 text-sm line-clamp-1">{exercise.details}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-white/60" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
