import React from 'react';
import { ArrowLeft, Dumbbell, ChevronRight, Play, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useRoutines } from '../context/RoutineContext';

export const RoutineDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { routines } = useRoutines();
    const routine = routines.find(r => r.id === id);

    if (!routine) {
        return (
            <Layout>
                <div className="p-8 text-white">Routine not found</div>
            </Layout>
        );
    }

    const { name: routineName, exercises } = routine;

    return (
        <Layout title={routineName}>
            <div className="space-y-6 pb-24">
                <div className="flex items-center justify-between md:hidden">
                    <button onClick={() => navigate(-1)} className="text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    {/* Title handled by Layout on mobile, but we can override or just rely on it */}
                    <button className="text-white" onClick={() => navigate(`/routine/${id}/edit`)}>
                        <Edit className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">{routineName}</h2>
                    <Button variant="outline" onClick={() => navigate(`/routine/${id}/edit`)} className="border-white/20 hover:bg-white/10 text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Routine
                    </Button>
                </div>

                {/* Chart Card */}
                <Card className="bg-black/20 border border-white/5">
                    <div className="space-y-2 mb-4">
                        <p className="text-white text-base font-medium">Strength Progress</p>
                        <p className="text-white text-3xl font-bold">--</p>
                        <div className="flex gap-2 text-sm">
                            <span className="text-primary/70">Last 3 Months</span>
                            <span className="text-primary font-medium">--</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center h-48 text-white/60">
                        No data registered yet
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
                                        <p className="text-white/60 text-sm line-clamp-1">
                                            {exercise.sets} Sets • {(() => {
                                                if (!Array.isArray(exercise.reps) || exercise.reps.length === 0) return '0 Reps';
                                                const allSame = exercise.reps.every(r => r === exercise.reps[0]);
                                                return allSame ? `${exercise.reps[0]} Reps` : `${exercise.reps.join(', ')} Reps`;
                                            })()}
                                        </p>
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
