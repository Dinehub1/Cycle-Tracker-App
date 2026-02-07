import {
    addCycleEntry,
    getCycleData,
    getEntryByDate,
    getUserProfile,
    isOnboardingComplete,
    saveCycleData,
    saveUserProfile,
    setLastPeriodStart,
    setOnboardingComplete,
} from '@/services/storage';
import {
    CycleData,
    CycleEntry,
    CyclePhase,
    CycleStatus,
    DEFAULT_CYCLE_DATA,
    DEFAULT_USER_PROFILE,
    UserProfile,
} from '@/types';
import { useCallback, useEffect, useState } from 'react';

// Calculate cycle phase and status
function calculateCycleStatus(cycleData: CycleData): CycleStatus {
    const defaultStatus: CycleStatus = {
        currentDay: 1,
        phase: 'period',
        daysUntilPeriod: 0,
        fertileWindow: false,
        ovulationDay: false,
    };

    if (!cycleData.lastPeriodStart) {
        return defaultStatus;
    }

    const lastPeriod = new Date(cycleData.lastPeriodStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastPeriod.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastPeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate current day in cycle (1-indexed)
    const currentDay = (diffDays % cycleData.cycleLength) + 1;

    // Calculate days until next period
    const daysUntilPeriod = cycleData.cycleLength - currentDay + 1;

    // Determine phase
    let phase: CyclePhase;
    const ovulationDay = Math.floor(cycleData.cycleLength / 2); // Approximate
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;

    if (currentDay <= cycleData.periodLength) {
        phase = 'period';
    } else if (currentDay < fertileStart) {
        phase = 'follicular';
    } else if (currentDay >= fertileStart && currentDay <= fertileEnd) {
        phase = 'ovulation';
    } else {
        phase = 'luteal';
    }

    const fertileWindow = currentDay >= fertileStart && currentDay <= fertileEnd;
    const isOvulationDay = currentDay === ovulationDay;

    return {
        currentDay,
        phase,
        daysUntilPeriod,
        fertileWindow,
        ovulationDay: isOvulationDay,
    };
}

// Hook for cycle data
export function useCycleData() {
    const [cycleData, setCycleData] = useState<CycleData>(DEFAULT_CYCLE_DATA);
    const [cycleStatus, setCycleStatus] = useState<CycleStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        const data = await getCycleData();
        setCycleData(data);
        setCycleStatus(calculateCycleStatus(data));
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const saveData = useCallback(async (data: CycleData) => {
        const success = await saveCycleData(data);
        if (success) {
            setCycleData(data);
            setCycleStatus(calculateCycleStatus(data));
        }
        return success;
    }, []);

    const addEntry = useCallback(async (entry: CycleEntry) => {
        const success = await addCycleEntry(entry);
        if (success) {
            await loadData(); // Reload to get updated data
        }
        return success;
    }, [loadData]);

    const setLastPeriod = useCallback(async (date: string) => {
        const success = await setLastPeriodStart(date);
        if (success) {
            await loadData();
        }
        return success;
    }, [loadData]);

    return {
        cycleData,
        cycleStatus,
        loading,
        saveData,
        addEntry,
        setLastPeriod,
        refresh: loadData,
    };
}

// Hook for user profile
export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
        const newProfile = { ...profile, ...updates };
        const success = await saveUserProfile(newProfile);
        if (success) {
            setProfile(newProfile);
        }
        return success;
    }, [profile]);

    return {
        profile,
        loading,
        updateProfile,
        refresh: loadProfile,
    };
}

// Hook for onboarding status
export function useOnboarding() {
    const [isComplete, setIsComplete] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            const complete = await isOnboardingComplete();
            setIsComplete(complete);
            setLoading(false);
        };
        check();
    }, []);

    const completeOnboarding = useCallback(async () => {
        const success = await setOnboardingComplete(true);
        if (success) {
            setIsComplete(true);
        }
        return success;
    }, []);

    return {
        isComplete,
        loading,
        completeOnboarding,
    };
}

// Hook for getting entry by date
export function useDayEntry(date: string) {
    const [entry, setEntry] = useState<CycleEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getEntryByDate(date);
            setEntry(data);
            setLoading(false);
        };
        load();
    }, [date]);

    return { entry, loading };
}
