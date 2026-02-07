import {
    CycleData,
    CycleEntry,
    DEFAULT_CYCLE_DATA,
    DEFAULT_USER_PROFILE,
    STORAGE_KEYS,
    UserProfile,
} from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic storage functions
export async function getItem<T>(key: string): Promise<T | null> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Error reading ${key}:`, error);
        return null;
    }
}

export async function setItem<T>(key: string, value: T): Promise<boolean> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing ${key}:`, error);
        return false;
    }
}

export async function removeItem(key: string): Promise<boolean> {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing ${key}:`, error);
        return false;
    }
}

export async function clearAll(): Promise<boolean> {
    try {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

// Cycle Data functions
export async function getCycleData(): Promise<CycleData> {
    const data = await getItem<CycleData>(STORAGE_KEYS.CYCLE_DATA);
    return data ?? DEFAULT_CYCLE_DATA;
}

export async function saveCycleData(data: CycleData): Promise<boolean> {
    return setItem(STORAGE_KEYS.CYCLE_DATA, data);
}

export async function addCycleEntry(entry: CycleEntry): Promise<boolean> {
    const data = await getCycleData();

    // Check if entry for this date already exists
    const existingIndex = data.entries.findIndex(e => e.date === entry.date);

    if (existingIndex >= 0) {
        // Update existing entry
        data.entries[existingIndex] = {
            ...data.entries[existingIndex],
            ...entry,
            updatedAt: new Date().toISOString(),
        };
    } else {
        // Add new entry
        data.entries.push(entry);
    }

    // Sort entries by date (newest first)
    data.entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return saveCycleData(data);
}

export async function getEntryByDate(date: string): Promise<CycleEntry | null> {
    const data = await getCycleData();
    return data.entries.find(e => e.date === date) ?? null;
}

export async function setLastPeriodStart(date: string): Promise<boolean> {
    const data = await getCycleData();
    data.lastPeriodStart = date;
    return saveCycleData(data);
}

// User Profile functions
export async function getUserProfile(): Promise<UserProfile> {
    const data = await getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    return data ?? DEFAULT_USER_PROFILE;
}

export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
    return setItem(STORAGE_KEYS.USER_PROFILE, profile);
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
    const current = await getUserProfile();
    return saveUserProfile({ ...current, ...updates });
}

// Onboarding status
export async function isOnboardingComplete(): Promise<boolean> {
    const value = await getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value ?? false;
}

export async function setOnboardingComplete(complete: boolean = true): Promise<boolean> {
    return setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
}

// PIN functions
export async function getPin(): Promise<string | null> {
    return getItem<string>(STORAGE_KEYS.PIN);
}

export async function setPin(pin: string): Promise<boolean> {
    return setItem(STORAGE_KEYS.PIN, pin);
}

export async function clearAllData(): Promise<boolean> {
    try {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
}
