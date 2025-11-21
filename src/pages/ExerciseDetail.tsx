import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, TrendingUp, Dumbbell, Plus } from 'lucide-react';
{ id: 3, weight: '95 kg', details: '2 sets x 8 reps', date: 'Oct 21' },
{ id: 4, weight: '90 kg', details: '3 sets x 10 reps', date: 'Oct 14' },
    ];

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
                <p className="text-white text-base font-medium">Progress Over Time</p>
                <p className="text-white text-3xl font-bold">100 kg</p>
                <div className="flex gap-2 items-center text-sm">
                    <span className="text-primary/70">Last 3 Months</span>
                    <div className="flex items-center gap-1 text-primary">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">+10%</span>
                    </div>
                </div>

                {/* Chart Placeholder */}
                <div className="h-32 w-full bg-black/20 rounded-xl p-4 border border-white/5">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06f906" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#06f906" stopOpacity="0" />
                            </linearGradient>
                        </defs>
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
                    <div className="flex justify-between mt-2 text-primary/70 text-xs font-bold uppercase tracking-wider">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
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
                {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-background-dark border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                                <Dumbbell className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{item.weight}</p>
                                <p className="text-primary/70 text-sm">{item.details}</p>
                            </div>
                        </div>
                        <p className="text-primary/70 text-sm">{item.date}</p>
                    </div>
                ))}
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6 md:hidden">
                <Button variant="fab">
                    <Plus className="w-8 h-8" />
                </Button>
            </div>
        </div>
    </Layout>
);
};
