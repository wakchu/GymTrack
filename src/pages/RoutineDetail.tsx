import React, { useState, useEffect } from 'react';
import { ArrowLeft, Dumbbell, ChevronRight, Play, Edit, TrendingUp, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useRoutines } from '../context/RoutineContext';

export const RoutineDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { routines, deleteRoutine } = useRoutines();
    const routine = routines.find(r => r.id === id);

    const [stats, setStats] = useState({
        maxVolume: 0,
        progress: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (routine) {
            fetchLogs();
        }
    }, [routine]);

    const fetchLogs = async () => {
        if (!routine) return;

        try {
            // Get all exercise IDs in this routine
            const exerciseIds = routine.exercises.map(e => e.id);

            if (exerciseIds.length === 0) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('workout_logs')
                .select('*')
                .in('exercise_id', exerciseIds)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                calculateStats(data);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: any[]) => {
        if (!data.length) return;

        // Calculate Volume per Session for Chart
        // Group by date (YYYY-MM-DD)
        const volumeByDate: Record<string, number> = {};

        // Process data in reverse chronological order (oldest first) for the chart
        // The input 'data' is sorted descending (newest first), so we reverse it for processing
        [...data].reverse().forEach(log => {
            const date = new Date(log.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD
            const vol = (Number(log.weight) || 0) * (Number(log.reps) || 0);

            if (volumeByDate[date]) {
                volumeByDate[date] += vol;
            } else {
                volumeByDate[date] = vol;
            }
        });

        const chartDataArray = Object.entries(volumeByDate).map(([date, volume]) => ({
            date,
            volume,
            displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));

        setChartData(chartDataArray);

        // Calculate Stats
        const volumes = chartDataArray.map(d => d.volume);
        const maxVolume = Math.max(...volumes, 0);

        // Recent Progress (compare last session vs previous session)
        let progress = 0;
        if (volumes.length >= 2) {
            const current = volumes[volumes.length - 1];
            const previous = volumes[volumes.length - 2];
            if (previous > 0) {
                progress = ((current - previous) / previous) * 100;
            }
        }

        setStats({
            maxVolume,
            progress
        });
    };

    const handleDelete = async () => {
        if (!routine) return;

        if (window.confirm('Are you sure you want to delete this routine? This will delete all associated data including workout history for these exercises. This action cannot be undone.')) {
            try {
                await deleteRoutine(routine.id);
                navigate('/');
            } catch (error) {
                // Error is handled in context
            }
        }
    };

    if (!routine) {
        return (
            <Layout>
                <div className="p-8 text-white">Routine not found</div>
            </Layout>
        );
    }

    const { name: routineName, exercises } = routine;

    return (
        <Layout>
            <div className="space-y-6 pb-24">
                <div className="flex items-center justify-between md:hidden">
                    <button onClick={() => navigate(-1)} className="text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">{routineName}</h1>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1">
                            <MoreVertical className="w-6 h-6" />
                        </button>
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                                    <button
                                        onClick={() => navigate(`/routine/${id}/edit`)}
                                        className="w-full px-4 py-3 text-left text-white hover:bg-white/5 flex items-center gap-3"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Routine
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-500/10 flex items-center gap-3"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Routine
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">{routineName}</h2>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-6 h-6" />
                        </button>
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                                    <button
                                        onClick={() => navigate(`/routine/${id}/edit`)}
                                        className="w-full px-4 py-3 text-left text-white hover:bg-white/5 flex items-center gap-3"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Routine
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-500/10 flex items-center gap-3"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Routine
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Chart Card */}
                <Card className="bg-black/20 border border-white/5">
                    <div className="space-y-2 mb-4">
                        <p className="text-white text-base font-medium">Total Volume</p>
                        <p className="text-white text-3xl font-bold">{stats.maxVolume > 0 ? `${stats.maxVolume} kg` : '--'}</p>
                        <div className="flex gap-2 text-sm items-center">
                            <span className="text-primary/70">Last Session</span>
                            {stats.maxVolume > 0 && (
                                <div className={`flex items-center gap-1 ${stats.progress >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                    <TrendingUp className={`w-4 h-4 ${stats.progress < 0 ? 'rotate-180' : ''}`} />
                                    <span className="font-medium">{stats.progress > 0 ? '+' : ''}{stats.progress.toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-48 w-full relative overflow-hidden">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRoutineVolume" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06f906" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06f906" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="displayDate"
                                        stroke="#666"
                                        tick={{ fill: '#666', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        tick={{ fill: '#666', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={30}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#06f906' }}
                                        labelStyle={{ color: '#999' }}
                                        formatter={(value: number) => [`${value} kg`, 'Volume']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="volume"
                                        stroke="#06f906"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRoutineVolume)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/60">
                                {loading ? 'Loading data...' : 'No data registered yet'}
                            </div>
                        )}
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
