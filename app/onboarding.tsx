import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCycleData, useOnboarding } from '@/hooks/use-storage';

const { width } = Dimensions.get('window');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function formatDateISO(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function OnboardingScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const { setLastPeriod } = useCycleData();
    const { completeOnboarding } = useOnboarding();

    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const handleContinue = async () => {
        if (!selectedDate || saving) return;

        setSaving(true);

        // Save the selected date as last period start
        const dateISO = formatDateISO(currentYear, currentMonth, selectedDate);
        await setLastPeriod(dateISO);
        await completeOnboarding();

        setSaving(false);
        router.replace('/(tabs)');
    };

    // Check if a date is in the future
    const isFutureDate = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        return date > today;
    };

    const renderCalendar = () => {
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = selectedDate === day;
            const isFuture = isFutureDate(day);

            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayCell,
                        isSelected && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => !isFuture && setSelectedDate(day)}
                    disabled={isFuture}
                >
                    <Text style={[
                        styles.dayText,
                        { color: isSelected ? '#fff' : isFuture ? colors.textTertiary : colors.text },
                    ]}>
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name="calendar" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        When did your last period start?
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        This helps us calculate your cycle and provide accurate insights. You can always change this later.
                    </Text>
                </View>

                {/* Calendar */}
                <View style={[styles.calendarCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    {/* Month Navigation */}
                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                            <Ionicons name="chevron-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.monthTitle, { color: colors.text }]}>
                            {MONTHS[currentMonth]} {currentYear}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                            <Ionicons name="chevron-forward" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Weekday Headers */}
                    <View style={styles.weekdayRow}>
                        {WEEKDAYS.map((day) => (
                            <View key={day} style={styles.weekdayCell}>
                                <Text style={[styles.weekdayText, { color: colors.textSecondary }]}>
                                    {day}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.daysGrid}>
                        {renderCalendar()}
                    </View>
                </View>

                {/* Info Note */}
                <View style={[styles.infoNote, { backgroundColor: colors.backgroundTertiary }]}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Accurate dates help identify patterns in your health.
                    </Text>
                </View>
            </View>

            {/* Bottom Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        { backgroundColor: selectedDate ? colors.primary : colors.border },
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedDate || saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={[
                                styles.continueButtonText,
                                { color: selectedDate ? '#fff' : colors.textTertiary },
                            ]}>
                                Continue
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color={selectedDate ? '#fff' : colors.textTertiary}
                            />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const cellSize = (width - Spacing.lg * 2 - Spacing.md * 2) / 7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        textAlign: 'center',
        paddingHorizontal: Spacing.lg,
        lineHeight: 22,
    },
    calendarCard: {
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.sm,
    },
    navButton: {
        padding: Spacing.sm,
    },
    monthTitle: {
        ...Typography.h4,
    },
    weekdayRow: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    weekdayCell: {
        width: cellSize,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    weekdayText: {
        ...Typography.caption,
        fontWeight: '600',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: cellSize,
        height: cellSize,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.full,
    },
    dayText: {
        ...Typography.body,
    },
    infoNote: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    infoText: {
        ...Typography.bodySm,
        flex: 1,
    },
    bottomBar: {
        padding: Spacing.lg,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    continueButtonText: {
        ...Typography.bodyMedium,
    },
});
