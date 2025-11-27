import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, TrendingUp, Dumbbell, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useRoutines } from '../context/RoutineContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

export const ExerciseDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [view, setView] = useState<'history' | 'records'>('history');
    const { routines } = useRoutines();

    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        maxWeight: 0,
        totalVolume: 0,
        progress: 0
    });

    // Find exercise name from routines context
    const exerciseName = React.useMemo(() => {
        for (const r of routines) {
            const ex = r.exercises.find(e => e.id === id);
            if (ex) return ex.name;
        }
        return 'Exercise Detail';
    }, [routines, id]);

    useEffect(() => {
        if (id) {
            fetchLogs();
        }
    }, [id]);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('workout_logs')
                .select('*')
                .eq('exercise_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setLogs(data);
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

        // Max Weight
        const max = Math.max(...data.map(l => Number(l.weight) || 0));

        // Recent Progress (compare avg weight of last 3 sessions vs previous 3)
        // This is a simple approximation
        let progress = 0;
        if (data.length >= 2) {
            const current = Number(data[0].weight) || 0;
            const previous = Number(data[1].weight) || 0;
            if (previous > 0) {
                progress = ((current - previous) / previous) * 100;
            }
        }

        setStats({
            maxWeight: max,
            totalVolume: 0, // Not used yet
            progress
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDeleteLog = async (logId: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const { error } = await supabase
                .from('workout_logs')
                .delete()
                .eq('id', logId);

            if (error) throw error;

            // Update local state
            const updatedLogs = logs.filter(l => l.id !== logId);
            setLogs(updatedLogs);
            calculateStats(updatedLogs);
        } catch (error) {
            console.error('Error deleting log:', error);
            alert('Failed to delete record');
        }
    };

    return (
        <Layout title={exerciseName}>
            <div className="space-y-6 pb-24">
                <div className="flex items-center justify-between md:hidden">
                    <button onClick={() => navigate(-1)} className="text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    {/* Title handled by Layout */}
                    <button className="text-primary">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </div>

                {/* Chart Section */}
                <div className="space-y-2">
                    <p className="text-white text-base font-medium">Personal Record</p>
                    <p className="text-white text-3xl font-bold">{stats.maxWeight} kg</p>
                    <div className="flex gap-2 items-center text-sm">
                        <span className="text-primary/70">Last Session</span>
                        <div className={`flex items-center gap-1 ${stats.progress >= 0 ? 'text-primary' : 'text-red-500'}`}>
                            <TrendingUp className={`w-4 h-4 ${stats.progress < 0 ? 'rotate-180' : ''}`} />
                            <span className="font-medium">{stats.progress > 0 ? '+' : ''}{stats.progress.toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Chart Placeholder - Could be made real later */}
                    <div className="h-32 w-full bg-black/20 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                        {logs.length > 1 ? (
                            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                                <defs>
                                    <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#06f906" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#06f906" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Simple visualization of last few points if available, otherwise static curve */}
                                <path
                                    d="M0 100 C 50 100, 50 40, 100 40 C 150 40, 150 80, 200 80 C 250 80, 250 20, 300 20 C 350 20, 350 60, 400 60 V 150 H 0 Z"
                                    fill="url(#chartGradientGreen)"
                                />
                                <path
                                    d="M0 100 C 50 100, 50 40, 100 40 C 150 40, 150 80, 200 80 C 250 80, 250 20, 300 20 C 350 20, 350 60, 400 60"
                                    fill="none"
                                    stroke="#06f906"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/40 text-sm">
                                Not enough data for chart
                            </div>
                        )}
                    </div>
                </div>

                {/* Segmented Control */}
                <div className="flex p-1 bg-black/30 rounded-lg">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'history'
                            ? 'bg-background-dark text-white shadow-sm'
                            : 'text-primary/70 hover:text-white'
                            }`}
                        onClick={() => setView('history')}
                    >
                        Workout History
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'records'
                            ? 'bg-background-dark text-white shadow-sm'
                            : 'text-primary/70 hover:text-white'
                            }`}
                        onClick={() => setView('records')}
                    >
                        Personal Records
                    </button>
                </div>

                {/* History List */}
                <div className="space-y-2">
                    {loading ? (
                        <div className="text-center text-white/60 py-8">Loading history...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center text-white/60 py-8">No history yet</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-background-dark border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                                        <Dumbbell className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{log.weight} kg</p>
                                        <p className="text-primary/70 text-sm">{log.set_number} set • {log.reps} reps</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-primary/70 text-sm">{formatDate(log.created_at)}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLog(log.id);
                                        }}
                                        className="text-white/40 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* FAB */}
                <div className="fixed bottom-6 right-6 md:hidden z-[60]">
                    <Button variant="fab">
                        <Plus className="w-8 h-8" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
};
