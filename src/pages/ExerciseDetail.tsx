import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MoreVertical, TrendingUp, Dumbbell, Plus, Trash2, Pencil } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useRoutines } from '../context/RoutineContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

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
    const [chartData, setChartData] = useState<any[]>([]);

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        weight: '',
        reps: '',
        date: ''
    });

    // Find exercise name from routines context
    const exerciseName = useMemo(() => {
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
        let progress = 0;
        if (data.length >= 2) {
            const current = Number(data[0].weight) || 0;
            const previous = Number(data[1].weight) || 0;
            if (previous > 0) {
                progress = ((current - previous) / previous) * 100;
            }
        }

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

    const handleEditClick = (log: any) => {
        setEditingLog(log);
        setEditForm({
            weight: log.weight,
            reps: log.reps,
            date: new Date(log.created_at).toISOString().split('T')[0]
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingLog) return;

        try {
            const { error } = await supabase
                .from('workout_logs')
                .update({
                    weight: editForm.weight,
                    reps: editForm.reps,
                    created_at: new Date(editForm.date).toISOString()
                })
                .eq('id', editingLog.id);

            if (error) throw error;

            // Update local state
            const updatedLogs = logs.map(l =>
                l.id === editingLog.id
                    ? { ...l, weight: editForm.weight, reps: editForm.reps, created_at: new Date(editForm.date).toISOString() }
                    : l
            );

            // Re-sort logs by date descending
            updatedLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setLogs(updatedLogs);
            calculateStats(updatedLogs);
            setIsEditModalOpen(false);
            setEditingLog(null);
        } catch (error) {
            console.error('Error updating log:', error);
            alert('Failed to update record');
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
                <div className="space-y-4">
                    <div>
                        <p className="text-white text-base font-medium">Personal Record</p>
                        <p className="text-white text-3xl font-bold">{stats.maxWeight} kg</p>
                        <div className="flex gap-2 items-center text-sm">
                            <span className="text-primary/70">Last Session</span>
                            <div className={`flex items-center gap-1 ${stats.progress >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                <TrendingUp className={`w-4 h-4 ${stats.progress < 0 ? 'rotate-180' : ''}`} />
                                <span className="font-medium">{stats.progress > 0 ? '+' : ''}{stats.progress.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-white text-sm font-medium mb-2">Volume History</p>
                        <div className="h-48 w-full bg-black/20 rounded-xl p-2 border border-white/5 relative overflow-hidden">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
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
                                            fill="url(#colorVolume)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-white/40 text-sm">
                                    Not enough data for chart
                                </div>
                            )}
                        </div>
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
                                            handleEditClick(log);
                                        }}
                                        className="text-white/40 hover:text-white transition-colors p-1"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
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

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Record"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Weight (kg)"
                        type="number"
                        value={editForm.weight}
                        onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                    />
                    <Input
                        label="Reps"
                        type="number"
                        value={editForm.reps}
                        onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    />
                </div>
            </Modal>
        </Layout>
    );
};
