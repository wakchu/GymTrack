export interface Exercise {
    id: string;
    name: string;
    sets: string;
    reps: string[];
}

export interface Routine {
    id: string;
    name: string;
    exercises: Exercise[];
    details: string; // Derived from exercises count or custom
    icon: string; // Changed from any to string for serialization
    color?: string;
    bgColor?: string;
    createdAt?: string;
}
