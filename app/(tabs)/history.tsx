import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCycleData } from '@/hooks/use-storage';
import { CycleEntry, MoodType } from '@/types';

const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    calm: '😌',
    tired: '😴',
    anxious: '😰',
    irritated: '😤',
    sad: '😢',
};

const FILTERS = ['All', 'Symptoms', 'Flow', 'Notes'];

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { cycleData, loading, refresh } = useCycleData();
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

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
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // Filter Logic
    const filteredData = cycleData.entries.filter(entry => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Symptoms') return entry.symptoms && entry.symptoms.length > 0;
        if (activeFilter === 'Flow') return entry.flow && entry.flow !== 'none';
        if (activeFilter === 'Notes') return entry.notes;
        return true;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        };
    };

    const getFlowLevel = (flow: string | undefined): number => {
        if (!flow || flow === 'none') return 0;
        if (flow === 'light') return 1;
        if (flow === 'medium') return 2;
        if (flow === 'heavy') return 3;
        return 0;
    };

    const renderItem = ({ item, index }: { item: CycleEntry; index: number }) => {
        const { date, day } = formatDate(item.date);
        const flowLevel = getFlowLevel(item.flow);

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 50).duration(400)}
                style={styles.timelineItem}
            >
                {/* Timeline Visuals */}
                <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                    {index !== filteredData.length - 1 && (
                        <View style={styles.timelineLine} />
                    )}
                </View>

                {/* Entry Card */}
                <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.dateText}>{date}</Text>
                            <Text style={styles.dayText}>{day}</Text>
                        </View>
                        {item.mood && (
                            <Text style={styles.moodEmoji}>{moodEmojis[item.mood]}</Text>
                        )}
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.symptomContainer}>
                            {item.symptoms?.map((s, i) => (
                                <View key={i} style={styles.symptomPill}>
                                    <Text style={[styles.symptomText, { color: colors.primary }]}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </Text>
                                </View>
                            ))}
                            {(!item.symptoms || item.symptoms.length === 0) && (
                                <Text style={styles.emptyText}>No symptoms</Text>
                            )}
                        </View>

                        {/* Flow Indicator */}
                        <View style={styles.flowContainer}>
                            {[1, 2, 3].map((dot) => (
                                <View
                                    key={dot}
                                    style={[
                                        styles.flowDot,
                                        dot <= flowLevel
                                            ? { backgroundColor: colors.primary }
                                            : styles.flowDotInactive
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="calendar-outline" color="#1A1A1A" size={24} />
                </TouchableOpacity>
            </View>

            {/* Filter Section */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[
                                styles.filterPill,
                                activeFilter === filter && { backgroundColor: colors.primary }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.filterTextActive
                                ]}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No entries found</Text>
                        <Text style={styles.emptyDescription}>Try adjusting your filters or log a new day.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Manrope_700Bold',
        color: '#1A1A1A'
    },
    iconButton: {
        padding: 8,
        backgroundColor: '#F8F7FA',
        borderRadius: 12
    },
    filterWrapper: { marginBottom: 16 },
    filterScroll: { paddingHorizontal: 24, paddingBottom: 10 },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F3F3F7',
        marginRight: 10,
    },
    filterText: {
        fontFamily: 'Manrope_600SemiBold',
        color: '#666666',
        fontSize: 14
    },
    filterTextActive: { color: '#FFFFFF' },
    listContent: { paddingHorizontal: 24, paddingBottom: 40 },
    timelineItem: { flexDirection: 'row', marginBottom: 20 },
    timelineLeft: { width: 30, alignItems: 'center', paddingTop: 12 },
    timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 2, borderWidth: 2, borderColor: '#fff' },
    timelineLine: { position: 'absolute', top: 20, bottom: -40, width: 2, backgroundColor: '#F3F3F7' },
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F8F7FA',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    dateText: {
        fontSize: 16,
        fontFamily: 'Manrope_700Bold',
        color: '#1A1A1A'
    },
    dayText: {
        fontSize: 13,
        fontFamily: 'Manrope_400Regular',
        color: '#666666'
    },
    moodEmoji: { fontSize: 24 },
    cardBody: {
        justifyContent: 'space-between',
        gap: 12
    },
    symptomContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    symptomPill: {
        backgroundColor: '#F3F3F7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    symptomText: {
        fontSize: 12,
        fontFamily: 'Manrope_600SemiBold',
    },
    emptyText: {
        fontSize: 13,
        color: '#B6B1CC',
        fontFamily: 'Manrope_400Regular',
        fontStyle: 'italic'
    },
    flowContainer: {
        flexDirection: 'row',
        gap: 4,
        alignSelf: 'flex-start',
        marginTop: 4,
        padding: 4,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    flowDot: { width: 8, height: 8, borderRadius: 4 },
    flowDotInactive: { backgroundColor: '#E5E7EB' },
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyTitle: { fontFamily: 'Manrope_700Bold', fontSize: 18, color: '#1A1A1A', marginBottom: 8 },
    emptyDescription: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#666666' },
});
