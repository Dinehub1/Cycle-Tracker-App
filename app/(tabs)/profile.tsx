import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCycleData, useOnboarding, useUserProfile } from '@/hooks/use-storage';

interface GoalOption {
    id: string;
    title: string;
    description: string;
    icon: any;
    selected: boolean;
}

const goals: GoalOption[] = [
    {
        id: 'track',
        title: 'Track Cycle',
        description: "Understand your body's rhythm",
        icon: 'sync-outline',
        selected: true,
    },
    {
        id: 'pregnant',
        title: 'Get Pregnant',
        description: 'Identify your most fertile days',
        icon: 'heart-outline',
        selected: false,
    },
    {
        id: 'pregnancy',
        title: 'Track Pregnancy',
        description: "Follow your baby's growth",
        icon: 'rose-outline',
        selected: false,
    },
];

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { cycleData } = useCycleData();
    const { profile, updateProfile } = useUserProfile();
    const { clearData } = useOnboarding();

    const handleGoalSelect = async (goalId: string) => {
        await updateProfile({ goal: goalId as any });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>{profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: colors.text }]}>{profile.name || 'Guest User'}</Text>
                        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                            {profile.name ? `${profile.name.toLowerCase().replace(' ', '.')}@glow-app.com` : 'guest@glow-app.com'}
                        </Text>
                    </View>
                    <TouchableOpacity style={[styles.editButton, { borderColor: colors.border }]}>
                        <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* My Goal Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>My Goal</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                        Tailor your experience based on your needs
                    </Text>

                    <View style={styles.goalsContainer}>
                        {goals.map((goal) => (
                            <TouchableOpacity
                                key={goal.id}
                                style={[
                                    styles.goalCard,
                                    {
                                        backgroundColor: colors.cardBackground,
                                        borderColor: profile.goal === goal.id ? colors.primary : colors.cardBorder,
                                        borderWidth: profile.goal === goal.id ? 2 : 1,
                                    }
                                ]}
                                onPress={() => handleGoalSelect(goal.id)}
                            >
                                <View style={[
                                    styles.goalIcon,
                                    { backgroundColor: profile.goal === goal.id ? colors.primary + '20' : colors.backgroundSecondary }
                                ]}>
                                    <Ionicons
                                        name={goal.icon}
                                        size={24}
                                        color={profile.goal === goal.id ? colors.primary : colors.textSecondary}
                                    />
                                </View>
                                <View style={styles.goalContent}>
                                    <Text style={[styles.goalTitle, { color: colors.text }]}>{goal.title}</Text>
                                    <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
                                        {goal.description}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.goalRadio,
                                    {
                                        borderColor: profile.goal === goal.id ? colors.primary : colors.border,
                                        backgroundColor: profile.goal === goal.id ? colors.primary : 'transparent',
                                    }
                                ]}>
                                    {profile.goal === goal.id && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Cycle Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Cycle Details</Text>

                    <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                                <Text style={[styles.detailLabel, { color: colors.text }]}>Average Cycle</Text>
                            </View>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{cycleData.cycleLength} days</Text>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="water-outline" size={20} color={colors.primary} />
                                <Text style={[styles.detailLabel, { color: colors.text }]}>Period Length</Text>
                            </View>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{cycleData.periodLength} days</Text>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="pulse-outline" size={20} color={colors.primary} />
                                <Text style={[styles.detailLabel, { color: colors.text }]}>Luteal Phase</Text>
                            </View>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>~14 days</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Menu */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

                    {[
                        { icon: 'notifications-outline', label: 'Notifications', route: '/notifications' },
                        { icon: 'people-outline', label: 'Partner Sync', route: '/partner-sync' },
                        { icon: 'shield-checkmark-outline', label: 'Privacy & Security', route: '/privacy' },
                        { icon: 'help-circle-outline', label: 'Help & Support', route: null },
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { borderColor: colors.cardBorder }]}
                            onPress={() => item.route && router.push(item.route as any)}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: colors.backgroundSecondary }]}>
                                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: colors.error }]}
                    onPress={() => router.replace('/onboarding')}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
                </TouchableOpacity>

                {/* Delete Data Button */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: colors.error, marginTop: Spacing.sm, borderStyle: 'dashed' }]}
                    onPress={async () => {
                        const success = await clearData();
                        if (success) {
                            router.replace('/onboarding');
                        }
                    }}
                >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Delete All Data</Text>
                </TouchableOpacity>
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
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...Typography.h2,
        color: '#fff',
    },
    profileInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    profileName: {
        ...Typography.h3,
        marginBottom: Spacing.xs,
    },
    profileEmail: {
        ...Typography.bodySm,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h4,
        marginBottom: Spacing.xs,
    },
    sectionSubtitle: {
        ...Typography.bodySm,
        marginBottom: Spacing.md,
    },
    goalsContainer: {
        gap: Spacing.sm,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    goalIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    goalContent: {
        flex: 1,
    },
    goalTitle: {
        ...Typography.bodyMedium,
        marginBottom: Spacing.xs,
    },
    goalDescription: {
        ...Typography.caption,
    },
    goalRadio: {
        width: 24,
        height: 24,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsCard: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    detailLabel: {
        ...Typography.body,
    },
    detailValue: {
        ...Typography.bodyMedium,
    },
    divider: {
        height: 1,
        marginHorizontal: Spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    menuLabel: {
        ...Typography.body,
        flex: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    logoutText: {
        ...Typography.bodyMedium,
    },
});
