import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PrivacyScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [pinEnabled, setPinEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(true);

    const handleExportData = () => {
        Alert.alert(
            'Export Data',
            'Choose your export format:',
            [
                { text: 'CSV', onPress: () => console.log('Export CSV') },
                { text: 'PDF', onPress: () => console.log('Export PDF') },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => console.log('Delete account'),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    title: 'Privacy & Security',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.primary,
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Access Security */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Access Security</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: colors.text }]}>PIN Lock</Text>
                                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                    Secure access to your health data
                                </Text>
                            </View>
                            <Switch
                                value={pinEnabled}
                                onValueChange={setPinEnabled}
                                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                                thumbColor={pinEnabled ? colors.primary : colors.textTertiary}
                            />
                        </View>

                        {pinEnabled && (
                            <>
                                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                <TouchableOpacity style={styles.actionRow}>
                                    <Text style={[styles.actionText, { color: colors.primary }]}>Change PIN</Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: colors.text }]}>Biometric Unlock</Text>
                                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                    Use Face ID or Touch ID
                                </Text>
                            </View>
                            <Switch
                                value={biometricEnabled}
                                onValueChange={setBiometricEnabled}
                                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                                thumbColor={biometricEnabled ? colors.primary : colors.textTertiary}
                            />
                        </View>
                    </View>
                </View>

                {/* Data Management */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="folder-open-outline" size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.exportButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                        onPress={handleExportData}
                    >
                        <View style={[styles.exportIcon, { backgroundColor: colors.backgroundTertiary }]}>
                            <Ionicons name="download-outline" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.exportContent}>
                            <Text style={[styles.exportTitle, { color: colors.text }]}>Export All Data</Text>
                            <Text style={[styles.exportDescription, { color: colors.textSecondary }]}>
                                Download your history as CSV or PDF
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="warning-outline" size={20} color={colors.error} />
                        <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.dangerButton, { borderColor: colors.error }]}
                        onPress={handleDeleteAccount}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                        <View style={styles.dangerContent}>
                            <Text style={[styles.dangerTitle, { color: colors.error }]}>Delete Account & Data</Text>
                            <Text style={[styles.dangerDescription, { color: colors.textSecondary }]}>
                                This action cannot be undone
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Privacy Info */}
                <View style={[styles.infoCard, { backgroundColor: colors.backgroundTertiary }]}>
                    <Ionicons name="lock-closed" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Your health data is encrypted and stored securely. We never sell your personal information to third parties.
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.linkText, { color: colors.primary }]}>Read our Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
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
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h4,
    },
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    settingInfo: {
        flex: 1,
        marginRight: Spacing.md,
    },
    settingTitle: {
        ...Typography.bodyMedium,
        marginBottom: Spacing.xs,
    },
    settingDescription: {
        ...Typography.caption,
    },
    divider: {
        height: 1,
        marginHorizontal: Spacing.md,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    actionText: {
        ...Typography.bodyMedium,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    exportIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    exportContent: {
        flex: 1,
    },
    exportTitle: {
        ...Typography.bodyMedium,
        marginBottom: Spacing.xs,
    },
    exportDescription: {
        ...Typography.caption,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: Spacing.md,
    },
    dangerContent: {
        flex: 1,
    },
    dangerTitle: {
        ...Typography.bodyMedium,
        marginBottom: Spacing.xs,
    },
    dangerDescription: {
        ...Typography.caption,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    infoContent: {
        flex: 1,
    },
    infoText: {
        ...Typography.bodySm,
        marginBottom: Spacing.sm,
    },
    linkText: {
        ...Typography.bodyMedium,
    },
});
