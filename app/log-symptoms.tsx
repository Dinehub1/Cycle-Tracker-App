import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCycleData, useDayEntry } from '@/hooks/use-storage';
import { CycleEntry, FlowLevel, MoodType, SymptomType } from '@/types';

const flowOptions: FlowLevel[] = ['none', 'light', 'medium', 'heavy'];
const flowLabels: Record<FlowLevel, string> = {
    none: 'None',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
};

const moodOptions: { id: MoodType; label: string; emoji: string }[] = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'tired', label: 'Tired', emoji: '😴' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'irritated', label: 'Irritated', emoji: '😤' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
];

const symptomOptions: { id: SymptomType; label: string; icon: any }[] = [
    { id: 'cramps', label: 'Cramps', icon: 'flash-outline' },
    { id: 'headache', label: 'Headache', icon: 'medical-outline' },
    { id: 'bloating', label: 'Bloating', icon: 'water-outline' },
    { id: 'fatigue', label: 'Fatigue', icon: 'battery-half-outline' },
    { id: 'acne', label: 'Acne', icon: 'ellipse-outline' },
    { id: 'insomnia', label: 'Insomnia', icon: 'moon-outline' },
    { id: 'backpain', label: 'Back Pain', icon: 'body-outline' },
    { id: 'nausea', label: 'Nausea', icon: 'pulse-outline' },
];

function getTodayISO(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function LogSymptomsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const todayISO = getTodayISO();
    const { addEntry } = useCycleData();
    const { entry: existingEntry, loading } = useDayEntry(todayISO);

    const [selectedFlow, setSelectedFlow] = useState<FlowLevel | null>(null);
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
    const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    // Load existing entry if available
    useEffect(() => {
        if (existingEntry) {
            setSelectedFlow(existingEntry.flow ?? null);
            setSelectedMood(existingEntry.mood ?? null);
            setSymptoms(existingEntry.symptoms ?? []);
            setNotes(existingEntry.notes ?? '');
        }
    }, [existingEntry]);

    const toggleSymptom = (id: SymptomType) => {
        setSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (saving) return;

        setSaving(true);

        const entry: CycleEntry = {
            id: existingEntry?.id ?? generateId(),
            date: todayISO,
            flow: selectedFlow ?? undefined,
            mood: selectedMood ?? undefined,
            symptoms: symptoms.length > 0 ? symptoms : undefined,
            notes: notes.trim() || undefined,
            createdAt: existingEntry?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const success = await addEntry(entry);

        setSaving(false);

        if (success) {
            Alert.alert('Saved!', 'Your entry has been saved.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Error', 'Failed to save entry. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Flow Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIcon, { backgroundColor: colors.period + '20' }]}>
                            <Ionicons name="water" size={20} color={colors.period} />
                        </View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Flow</Text>
                    </View>
                    <View style={styles.flowOptions}>
                        {flowOptions.map((flow) => (
                            <TouchableOpacity
                                key={flow}
                                style={[
                                    styles.flowOption,
                                    {
                                        backgroundColor: selectedFlow === flow ? colors.period : colors.backgroundSecondary,
                                        borderColor: selectedFlow === flow ? colors.period : colors.border,
                                    }
                                ]}
                                onPress={() => setSelectedFlow(flow)}
                            >
                                <Text style={[
                                    styles.flowText,
                                    { color: selectedFlow === flow ? '#fff' : colors.textSecondary }
                                ]}>
                                    {flowLabels[flow]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Mood Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIcon, { backgroundColor: colors.ovulation + '20' }]}>
                            <Ionicons name="happy" size={20} color={colors.ovulation} />
                        </View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Mood</Text>
                    </View>
                    <View style={styles.moodGrid}>
                        {moodOptions.map((mood) => (
                            <TouchableOpacity
                                key={mood.id}
                                style={[
                                    styles.moodOption,
                                    {
                                        backgroundColor: selectedMood === mood.id ? colors.primary + '20' : colors.backgroundSecondary,
                                        borderColor: selectedMood === mood.id ? colors.primary : colors.border,
                                    }
                                ]}
                                onPress={() => setSelectedMood(mood.id)}
                            >
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={[styles.moodLabel, { color: colors.text }]}>{mood.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Symptoms Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIcon, { backgroundColor: colors.info + '20' }]}>
                            <Ionicons name="medical" size={20} color={colors.info} />
                        </View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Symptoms</Text>
                    </View>
                    <View style={styles.symptomsGrid}>
                        {symptomOptions.map((symptom) => (
                            <TouchableOpacity
                                key={symptom.id}
                                style={[
                                    styles.symptomOption,
                                    {
                                        backgroundColor: symptoms.includes(symptom.id) ? colors.primary + '20' : colors.backgroundSecondary,
                                        borderColor: symptoms.includes(symptom.id) ? colors.primary : colors.border,
                                    }
                                ]}
                                onPress={() => toggleSymptom(symptom.id)}
                            >
                                <Ionicons
                                    name={symptom.icon}
                                    size={20}
                                    color={symptoms.includes(symptom.id) ? colors.primary : colors.textSecondary}
                                />
                                <Text style={[
                                    styles.symptomLabel,
                                    { color: symptoms.includes(symptom.id) ? colors.primary : colors.text }
                                ]}>
                                    {symptom.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Daily Notes Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIcon, { backgroundColor: colors.backgroundTertiary }]}>
                            <Ionicons name="create" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Notes</Text>
                    </View>
                    <TextInput
                        style={[
                            styles.notesInput,
                            {
                                backgroundColor: colors.backgroundSecondary,
                                color: colors.text,
                                borderColor: colors.border,
                            }
                        ]}
                        placeholder="How are you feeling today?"
                        placeholderTextColor={colors.textTertiary}
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>

            {/* Save Button */}
            <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                            <Text style={styles.saveButtonText}>Save Entry</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
        paddingTop: Spacing.md,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionIcon: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.h4,
    },
    flowOptions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    flowOption: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    flowText: {
        ...Typography.bodyMedium,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    moodOption: {
        width: '31%',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    moodEmoji: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    moodLabel: {
        ...Typography.caption,
    },
    symptomsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    symptomOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        gap: Spacing.xs,
    },
    symptomLabel: {
        ...Typography.bodySm,
    },
    notesInput: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        padding: Spacing.md,
        minHeight: 100,
        ...Typography.body,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        borderTopWidth: 1,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    saveButtonText: {
        ...Typography.bodyMedium,
        color: '#fff',
    },
});
