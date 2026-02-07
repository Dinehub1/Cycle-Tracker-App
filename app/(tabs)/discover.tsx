import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const featuredArticles = [
    {
        id: 1,
        title: 'Mastering Your Luteal Phase Nutrition',
        readTime: '5 min read',
        color: '#8b5cf6',
    },
    {
        id: 2,
        title: 'Cycle-Syncing Your Daily Workouts',
        readTime: '4 min read',
        color: '#ec4899',
    },
];

const latestInsights = [
    {
        id: 1,
        title: '5 Hydration Habits to Reduce Period Bloating',
        icon: 'water-outline',
        category: 'Wellness',
    },
    {
        id: 2,
        title: "The Science of PMS: What's Actually Happening?",
        icon: 'flask-outline',
        category: 'Education',
    },
    {
        id: 3,
        title: 'Managing Anxiety Fluctuations Throughout Your Cycle',
        icon: 'heart-outline',
        category: 'Mental Health',
    },
    {
        id: 4,
        title: 'Low Impact Exercise Ideas for Flow Days',
        icon: 'fitness-outline',
        category: 'Fitness',
    },
];

const categories = [
    { id: 1, name: 'All', icon: 'grid-outline' },
    { id: 2, name: 'Nutrition', icon: 'nutrition-outline' },
    { id: 3, name: 'Fitness', icon: 'fitness-outline' },
    { id: 4, name: 'Wellness', icon: 'leaf-outline' },
    { id: 5, name: 'Education', icon: 'school-outline' },
];

export default function DiscoverScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Search Bar */}
                <TouchableOpacity
                    style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}
                >
                    <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.searchPlaceholder, { color: colors.textTertiary }]}>
                        Search articles...
                    </Text>
                </TouchableOpacity>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScroll}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryChip,
                                {
                                    backgroundColor: index === 0 ? colors.primary : colors.backgroundSecondary,
                                },
                            ]}
                        >
                            <Ionicons
                                name={category.icon as any}
                                size={16}
                                color={index === 0 ? '#fff' : colors.textSecondary}
                            />
                            <Text style={[
                                styles.categoryText,
                                { color: index === 0 ? '#fff' : colors.textSecondary }
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredScroll}
                    >
                        {featuredArticles.map((article) => (
                            <TouchableOpacity
                                key={article.id}
                                style={styles.featuredCard}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={[article.color, article.color + 'cc']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.featuredGradient}
                                >
                                    <View style={styles.featuredContent}>
                                        <View style={styles.featuredBadge}>
                                            <Ionicons name="bookmark" size={16} color="#fff" />
                                        </View>
                                        <View style={styles.featuredTextContainer}>
                                            <Text style={styles.featuredTitle}>{article.title}</Text>
                                            <View style={styles.featuredMeta}>
                                                <Ionicons name="book-outline" size={14} color="rgba(255,255,255,0.8)" />
                                                <Text style={styles.featuredReadTime}>{article.readTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Latest Insights */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Insights</Text>
                        <TouchableOpacity>
                            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {latestInsights.map((insight) => (
                        <TouchableOpacity
                            key={insight.id}
                            style={[styles.insightCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                        >
                            <View style={[styles.insightIcon, { backgroundColor: colors.backgroundTertiary }]}>
                                <Ionicons name={insight.icon as any} size={24} color={colors.primary} />
                            </View>
                            <View style={styles.insightContent}>
                                <Text style={[styles.insightCategory, { color: colors.primary }]}>
                                    {insight.category}
                                </Text>
                                <Text style={[styles.insightTitle, { color: colors.text }]} numberOfLines={2}>
                                    {insight.title}
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
        paddingBottom: Spacing.xxl,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    searchPlaceholder: {
        ...Typography.body,
    },
    categoriesScroll: {
        marginTop: Spacing.lg,
    },
    categoriesContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
        marginRight: Spacing.sm,
    },
    categoryText: {
        ...Typography.label,
    },
    section: {
        marginTop: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h3,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    featuredScroll: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    featuredCard: {
        width: width * 0.75,
        height: 180,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginRight: Spacing.md,
    },
    featuredGradient: {
        flex: 1,
        padding: Spacing.lg,
    },
    featuredContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    featuredBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    featuredTextContainer: {
        gap: Spacing.sm,
    },
    featuredTitle: {
        ...Typography.h3,
        color: '#fff',
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    featuredReadTime: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.sm,
    },
    insightIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    insightContent: {
        flex: 1,
    },
    insightCategory: {
        ...Typography.caption,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    insightTitle: {
        ...Typography.bodyMedium,
    },
});
