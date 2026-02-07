// Storage Keys
export const STORAGE_KEYS = {
    USER_PROFILE: '@cycle_tracker/user_profile',
    CYCLE_DATA: '@cycle_tracker/cycle_data',
    ONBOARDING_COMPLETE: '@cycle_tracker/onboarding_complete',
    PIN: '@cycle_tracker/pin',
} as const;

// Flow intensity levels
export type FlowLevel = 'none' | 'light' | 'medium' | 'heavy';

// Mood options
export type MoodType = 'happy' | 'calm' | 'tired' | 'anxious' | 'irritated' | 'sad';

// Symptom options
export type SymptomType =
    | 'cramps'
    | 'headache'
    | 'bloating'
    | 'fatigue'
    | 'acne'
    | 'insomnia'
    | 'backpain'
    | 'nausea';

// Individual day entry
export interface CycleEntry {
    id: string;
    date: string; // ISO date string (YYYY-MM-DD)
    flow?: FlowLevel;
    mood?: MoodType;
    symptoms?: SymptomType[];
    notes?: string;
    sleep?: {
        hours: number;
        quality: 'poor' | 'fair' | 'good' | 'excellent';
    };
    exercise?: {
        type: string;
        duration: number; // minutes
        intensity: 'low' | 'medium' | 'high';
    };
    createdAt: string;
    updatedAt: string;
}

// Overall cycle data
export interface CycleData {
    lastPeriodStart: string | null; // ISO date string
    cycleLength: number; // days (default: 28)
    periodLength: number; // days (default: 5)
    entries: CycleEntry[];
}

// User goals
export type GoalType = 'track_period' | 'fertility' | 'health' | 'pregnancy';

// User profile and settings
export interface UserProfile {
    name: string;
    goals: GoalType[];
    pinEnabled: boolean;
    biometricEnabled: boolean;
    notificationsEnabled: boolean;
    reminderTime: string; // e.g., "9:00 AM"
    partnerSyncEnabled: boolean;
}

// Default values
export const DEFAULT_CYCLE_DATA: CycleData = {
    lastPeriodStart: null,
    cycleLength: 28,
    periodLength: 5,
    entries: [],
};

export const DEFAULT_USER_PROFILE: UserProfile = {
    name: '',
    goals: [],
    pinEnabled: false,
    biometricEnabled: false,
    notificationsEnabled: true,
    reminderTime: '9:00 AM',
    partnerSyncEnabled: false,
};

// Cycle phase calculation
export type CyclePhase = 'period' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleStatus {
    currentDay: number;
    phase: CyclePhase;
    daysUntilPeriod: number;
    fertileWindow: boolean;
    ovulationDay: boolean;
}
