import React, { useState, useMemo } from 'react';
import { Dumbbell, ChevronRight, Plus, PersonStanding, ArrowUpDown, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useRoutines } from '../context/RoutineContext';

const iconMap: Record<string, React.ElementType> = {
    dumbbell: Dumbbell,
    'person-standing': PersonStanding,
};

type SortOption = 'name' | 'date';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { routines } = useRoutines();
    const [sortBy, setSortBy] = useState<SortOption>('name');

    const sortedRoutines = useMemo(() => {
        return [...routines].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                // Sort by date descending (newest first)
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            }
        });
    }, [routines, sortBy]);

    const toggleSort = () => {
        setSortBy(prev => prev === 'name' ? 'date' : 'name');
    };

    return (
        <Layout>
            <div className="space-y-4 pb-24">
                <div className="flex justify-between items-center px-1">
                    <h1 className="text-2xl font-bold">My Routines</h1>
                    <button
                        onClick={toggleSort}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                        {sortBy === 'name' ? (
                            <>
                                <Calendar className="w-4 h-4" />
                                <span>Sort by Date</span>
                            </>
                        ) : (
                            <>
                                <ArrowUpDown className="w-4 h-4" />
                                <span>Sort by Name</span>
                            </>
                        )}
                    </button>
                </div>

                {sortedRoutines.map((routine) => {
                    const IconComponent = iconMap[routine.icon] || Dumbbell;
                    return (
                        <Card
                            key={routine.id}
                            className="flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
                            onClick={() => navigate(`/routine/${routine.id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`${routine.color} flex items-center justify-center rounded-lg ${routine.bgColor} shrink-0 w-12 h-12`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[#E0E0E0] text-base font-medium leading-normal line-clamp-1">
                                        {routine.name}
                                    </p>
                                    <p className="text-[#888888] text-sm font-normal leading-normal line-clamp-2">
                                        {routine.details}
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0 text-[#888888] group-hover:text-white transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </Card>
                    );
                })}

                {/* Floating Action Button for Mobile */}
                <div className="fixed bottom-6 right-6 md:hidden">
                    <Button
                        variant="fab"
                        onClick={() => navigate('/create')}
                        aria-label="Create Routine"
                    >
                        <Plus className="w-8 h-8" />
                    </Button>
                </div>

                {/* Desktop Create Button (optional, maybe in header or sidebar, but for now sticking to mobile design ported) */}
            </div>
        </Layout>
    );
};
