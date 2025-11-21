import React from 'react';
import { ArrowLeft, MoreVertical, Dumbbell, ChevronRight, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressChart } from '../components/ui/ProgressChart';

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

                    <ProgressChart
                        data={[
                            { name: 'Jun', value: 135 },
                            { name: 'Jul', value: 142 },
                            { name: 'Aug', value: 150 },
                            { name: 'Sep', value: 148 },
                            { name: 'Oct', value: 155 },
                            { name: 'Nov', value: 162 },
                        ]}
                    />

                    <div className="flex justify-between mt-4 text-primary/70 text-xs font-bold uppercase tracking-wider">
                        <span>Jun</span>
                        <span>Nov</span>
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
