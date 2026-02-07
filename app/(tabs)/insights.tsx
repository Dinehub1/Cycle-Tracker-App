import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const cycleData = [
    { month: 'JAN', value: 28 },
    { month: 'FEB', value: 29 },
    { month: 'MAR', value: 27 },
    { month: 'APR', value: 28 },
    { month: 'MAY', value: 30 },
    { month: 'JUN', value: 28 },
];

const articles = [
    {
        id: 1,
        title: 'Understanding the Luteal Phase and your Mood',
        readTime: '4 min read',
        icon: 'bulb-outline',
    },
    {
        id: 2,
        title: 'The Best Superfoods to Balance Your Period',
        readTime: '6 min read',
        icon: 'nutrition-outline',
    },
    {
        id: 3,
        title: 'How Stress Impacts Your Cycle Regularity',
        readTime: '3 min read',
        icon: 'pulse-outline',
    },
];

export default function InsightsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const maxValue = Math.max(...cycleData.map(d => d.value));
    const chartHeight = 120;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Cycle Length Chart */}
                <View style={[styles.chartCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>
                        Cycle Length Variation
                    </Text>
                    <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
                        28 days avg.
                    </Text>

                    <View style={styles.chartContainer}>
                        {cycleData.map((data, index) => {
                            const barHeight = (data.value / maxValue) * chartHeight;
                            return (
                                <View key={index} style={styles.barContainer}>
                                    <View style={styles.barWrapper}>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: barHeight,
                                                    backgroundColor: index === cycleData.length - 1 ? colors.primary : colors.primaryLight + '60',
                                                }
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                                        {data.month}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>28</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days</Text>
                        <Text style={[styles.statDescription, { color: colors.text }]}>Avg. Cycle</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.statRow}>
                            <Ionicons name="remove" size={16} color={colors.success} />
                            <Text style={[styles.statChange, { color: colors.success }]}>0%</Text>
                        </View>
                        <Text style={[styles.statDescription, { color: colors.text }]}>change</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={[styles.consistencyBadge, { backgroundColor: colors.success + '20' }]}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        </View>
                        <Text style={[styles.statDescription, { color: colors.text }]}>High</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Consistency</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={[styles.logsBadge, { backgroundColor: colors.primary + '20' }]}>
                            <Ionicons name="document-text" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.statDescription, { color: colors.text }]}>Consistent</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>logs</Text>
                    </View>
                </View>

                {/* Discover Section */}
                <View style={styles.discoverSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover</Text>
                        <TouchableOpacity>
                            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {articles.map((article) => (
                        <TouchableOpacity
                            key={article.id}
                            style={[styles.articleCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                        >
                            <View style={[styles.articleIcon, { backgroundColor: colors.backgroundTertiary }]}>
                                <Ionicons name={article.icon as any} size={24} color={colors.primary} />
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { color: colors.text }]} numberOfLines={2}>
                                    {article.title}
                                </Text>
                                <Text style={[styles.articleReadTime, { color: colors.textSecondary }]}>
                                    {article.readTime}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
        paddingTop: Spacing.md,
    },
    chartCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        marginBottom: Spacing.lg,
    },
    chartTitle: {
        ...Typography.h4,
        marginBottom: Spacing.xs,
    },
    chartSubtitle: {
        ...Typography.bodySm,
        marginBottom: Spacing.lg,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: 120,
        justifyContent: 'flex-end',
        marginBottom: Spacing.sm,
    },
    bar: {
        width: 32,
        borderRadius: BorderRadius.md,
    },
    barLabel: {
        ...Typography.caption,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    statCard: {
        width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
    },
    statLabel: {
        ...Typography.caption,
    },
    statDescription: {
        ...Typography.bodyMedium,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    statChange: {
        ...Typography.h3,
    },
    consistencyBadge: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    logsBadge: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    discoverSection: {
        marginTop: Spacing.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h3,
    },
    seeAllText: {
        ...Typography.bodyMedium,
    },
    articleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.sm,
    },
    articleIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    articleContent: {
        flex: 1,
    },
    articleTitle: {
        ...Typography.bodyMedium,
        marginBottom: Spacing.xs,
    },
    articleReadTime: {
        ...Typography.caption,
    },
});
