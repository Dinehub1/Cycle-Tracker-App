import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCycleData } from '@/hooks/use-storage';
import { CycleEntry, FlowLevel, MoodType } from '@/types';

const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    calm: '😌',
    tired: '😴',
    anxious: '😰',
    irritated: '😤',
    sad: '😢',
};

const flowLabels: Record<FlowLevel, string> = {
    none: 'No Flow',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
};

const flowColors: Record<FlowLevel, string> = {
    none: '#9ca3af',
    light: '#f9a8d4',
    medium: '#ec4899',
    heavy: '#be185d',
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === formatISO(today)) return 'Today';
    if (dateStr === formatISO(yesterday)) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function formatISO(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface DayCardProps {
    entry: CycleEntry;
    colors: any;
    expanded: boolean;
    onToggle: () => void;
}

function DayCard({ entry, colors, expanded, onToggle }: DayCardProps) {
    return (
        <TouchableOpacity
            style={[styles.dayCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={styles.dayCardHeader}>
                <View style={styles.dayInfo}>
                    <Text style={[styles.dayDate, { color: colors.text }]}>{formatDate(entry.date)}</Text>
                    <View style={styles.dayMeta}>
                        {entry.mood && (
                            <Text style={styles.moodEmoji}>{moodEmojis[entry.mood]}</Text>
                        )}
                        {entry.flow && entry.flow !== 'none' && (
                            <View style={[styles.flowBadge, { backgroundColor: flowColors[entry.flow] + '20' }]}>
                                <View style={[styles.flowDot, { backgroundColor: flowColors[entry.flow] }]} />
                                <Text style={[styles.flowText, { color: flowColors[entry.flow] }]}>
                                    {flowLabels[entry.flow]}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textTertiary}
                />
            </View>

            {expanded && (
                <View style={styles.dayCardExpanded}>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {entry.symptoms && entry.symptoms.length > 0 && (
                        <View style={styles.symptomsList}>
                            <Text style={[styles.expandedLabel, { color: colors.textSecondary }]}>Symptoms</Text>
                            <View style={styles.symptomsChips}>
                                {entry.symptoms.map((symptom) => (
                                    <View
                                        key={symptom}
                                        style={[styles.symptomChip, { backgroundColor: colors.backgroundTertiary }]}
                                    >
                                        <Text style={[styles.symptomText, { color: colors.text }]}>
                                            {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {entry.notes && (
                        <View style={styles.notesSection}>
                            <Text style={[styles.expandedLabel, { color: colors.textSecondary }]}>Notes</Text>
                            <Text style={[styles.notesText, { color: colors.text }]}>{entry.notes}</Text>
                        </View>
                    )}

                    {!entry.symptoms?.length && !entry.notes && (
                        <Text style={[styles.noDetailsText, { color: colors.textTertiary }]}>
                            No additional details logged
                        </Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const { cycleData, loading, refresh } = useCycleData();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'flow' | 'symptoms'>('all');
    const [refreshing, setRefreshing] = useState(false);

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    }, [refresh]);

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // Filter entries
    const filteredEntries = cycleData.entries.filter(entry => {
        if (filter === 'all') return true;
        if (filter === 'flow') return entry.flow && entry.flow !== 'none';
        if (filter === 'symptoms') return entry.symptoms && entry.symptoms.length > 0;
        return true;
    });

    const toggleExpanded = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Symptom History</Text>
            </View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
                contentContainerStyle={styles.filtersContent}
            >
                {[
                    { key: 'all', label: 'All' },
                    { key: 'flow', label: 'Flow Days' },
                    { key: 'symptoms', label: 'Symptoms' },
                ].map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: filter === f.key ? colors.primary : colors.backgroundSecondary,
                            }
                        ]}
                        onPress={() => setFilter(f.key as any)}
                    >
                        <Text style={[
                            styles.filterText,
                            { color: filter === f.key ? '#fff' : colors.textSecondary }
                        ]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* History List with Pull to Refresh */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {filteredEntries.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: colors.backgroundTertiary }]}>
                            <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No entries yet</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Start logging your symptoms to see your history here
                        </Text>
                    </View>
                ) : (
                    filteredEntries.map((entry) => (
                        <DayCard
                            key={entry.id}
                            entry={entry}
                            colors={colors}
                            expanded={expandedId === entry.id}
                            onToggle={() => toggleExpanded(entry.id)}
                        />
                    ))
                )}
            </ScrollView>
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
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    title: {
        ...Typography.h2,
    },
    filtersScroll: {
        maxHeight: 50,
    },
    filtersContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
    },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
    },
    filterText: {
        ...Typography.label,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    dayCard: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    dayCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    dayInfo: {
        flex: 1,
    },
    dayDate: {
        ...Typography.bodyMedium,
        marginBottom: Spacing.xs,
    },
    dayMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    moodEmoji: {
        fontSize: 20,
    },
    flowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
    },
    flowDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    flowText: {
        ...Typography.caption,
        fontWeight: '600',
    },
    dayCardExpanded: {
        padding: Spacing.md,
        paddingTop: 0,
    },
    divider: {
        height: 1,
        marginBottom: Spacing.md,
    },
    expandedLabel: {
        ...Typography.caption,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    symptomsList: {
        marginBottom: Spacing.md,
    },
    symptomsChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    symptomChip: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    symptomText: {
        ...Typography.caption,
    },
    notesSection: {
        marginTop: Spacing.sm,
    },
    notesText: {
        ...Typography.bodySm,
        lineHeight: 20,
    },
    noDetailsText: {
        ...Typography.bodySm,
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl * 2,
    },
    emptyIcon: {
        width: 96,
        height: 96,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        ...Typography.h3,
        marginBottom: Spacing.sm,
    },
    emptyText: {
        ...Typography.body,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
});
