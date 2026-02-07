import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ARTICLES = [
    {
        id: '1',
        title: 'Understanding Your Cycle Phases',
        duration: '5 min read',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a092dd14?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: '2',
        title: 'Foods to Boost Energy During Your Period',
        duration: '3 min read',
        category: 'Nutrition',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: '3',
        title: 'Yoga Poses for Cramp Relief',
        duration: '7 min read',
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1544367563-121955bf558b?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: '4',
        title: 'Sleep and Hormones: The Link',
        duration: '4 min read',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1541781777-c186d97cabe7?auto=format&fit=crop&q=80&w=300',
    },
];

const DiscoverScreen = () => {

    const renderItem = ({ item }: { item: typeof ARTICLES[0] }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
                <View style={styles.tagContainer}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaContainer}>
                    <View style={styles.durationTag}>
                        <Ionicons name="time-outline" size={12} color="#ec135b" style={{ marginRight: 4 }} />
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover</Text>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="person-circle-outline" size={32} color="#111827" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search articles..."
                    style={styles.searchInput}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <FlatList
                data={ARTICLES}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Manrope_700Bold',
        color: '#111827',
    },
    profileButton: {
        //
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        marginHorizontal: 20,
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Manrope_400Regular',
        fontSize: 16,
        color: '#111827',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    tagContainer: {
        marginBottom: 6,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: 'Manrope_600SemiBold',
        color: '#6b7280',
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Manrope_700Bold',
        color: '#111827',
        marginBottom: 8,
        lineHeight: 22,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fdf2f4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    durationText: {
        fontSize: 12,
        fontFamily: 'Manrope_600SemiBold',
        color: '#ec135b',
    },
});

export default DiscoverScreen;
