import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import { BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const THEME_COLOR = '#ec135b'; // Or use Colors.light.primary if strictly following theme
const BACKGROUND_COLOR = '#fdfdfd';
const SECONDARY_TEXT = '#6b7280';

const HealthInsightsScreen = () => {
    // Chart Data
    const cycleHistoryData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                data: [28, 29, 27, 30, 28, 28],
                color: (opacity = 1) => `rgba(236, 19, 91, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    const symptomData = {
        labels: ['Cramps', 'Mood', 'Acne', 'Fatigue'],
        datasets: [
            {
                data: [8, 4, 2, 6],
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(236, 19, 91, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#fff',
        },
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header - Adjusted for Tab Screen (No back button needed usually) */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Insights</Text>
                <TouchableOpacity style={styles.calendarButton}>
                    <Ionicons name="calendar-outline" size={24} color={THEME_COLOR} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Cycle Length Trend */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Cycle History</Text>
                        <Text style={styles.cardSubtitle}>Avg. 28 days</Text>
                    </View>
                    <LineChart
                        data={cycleHistoryData}
                        width={width - 48} // Adjusted width
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withOuterLines={false}
                        verticalLabelRotation={0}
                    />
                </View>

                {/* Symptom Trends */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Top Symptoms</Text>
                        <Text style={styles.cardSubtitle}>Last 30 days</Text>
                    </View>
                    <BarChart
                        data={symptomData}
                        width={width - 48}
                        height={220}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(236, 19, 91, ${opacity})`,
                        }}
                        style={styles.chart}
                        withInnerLines={false}
                        fromZero
                        showValuesOnTopOfBars
                        yAxisLabel=""
                        yAxisSuffix=""
                    />
                </View>

                {/* Personalized Tips */}
                <View style={styles.tipsSection}>
                    <Text style={styles.sectionTitle}>Personalized Tips</Text>
                    <View style={styles.tipCard}>
                        <View style={styles.tipIconContainer}>
                            <MaterialCommunityIcons name="lightning-bolt" size={24} color={THEME_COLOR} />
                        </View>
                        <View style={styles.tipTextContainer}>
                            <Text style={styles.tipTitle}>Energy Peak</Text>
                            <Text style={styles.tipDescription}>
                                You're in your Follicular phase. It's a great time for high-intensity workouts!
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.tipCard, { backgroundColor: '#fdf2f4' }]}>
                        <View style={[styles.tipIconContainer, { backgroundColor: '#fff' }]}>
                            <Ionicons name="leaf-outline" size={24} color={THEME_COLOR} />
                        </View>
                        <View style={styles.tipTextContainer}>
                            <Text style={styles.tipTitle}>Hydration Alert</Text>
                            <Text style={styles.tipDescription}>
                                Users with your pattern often feel bloated. Increase water intake by 500ml today.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        // hidden
    },
    calendarButton: {
        padding: 8,
        backgroundColor: '#fdf2f4',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Manrope_700Bold',
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Manrope_700Bold',
        color: '#1f2937',
    },
    cardSubtitle: {
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        color: SECONDARY_TEXT,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Manrope_700Bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    tipsSection: {
        marginBottom: 20,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    tipIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#fff1f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontFamily: 'Manrope_700Bold',
        color: '#111827',
    },
    tipDescription: {
        fontSize: 14,
        fontFamily: 'Manrope_400Regular',
        color: SECONDARY_TEXT,
        lineHeight: 20,
        marginTop: 2,
    },
});

export default HealthInsightsScreen;
