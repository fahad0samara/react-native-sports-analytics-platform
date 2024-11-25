import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PredictionFeed from '../../components/social/PredictionFeed';

// Mock data - Replace with actual API calls
const mockPredictions = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'JohnDoe',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true,
    },
    match: {
      homeTeam: {
        name: 'Manchester United',
        logo: 'https://example.com/man-utd.png',
      },
      awayTeam: {
        name: 'Liverpool',
        logo: 'https://example.com/liverpool.png',
      },
      date: '2024-02-20T15:00:00Z',
      league: 'Premier League',
    },
    prediction: {
      winner: 'home' as const,
      confidence: 85,
      analysis: 'Manchester United's recent form and home advantage gives them the edge in this crucial match.',
      timestamp: '2024-02-19T10:30:00Z',
    },
    social: {
      likes: 128,
      comments: 32,
      hasLiked: false,
    },
  },
  // Add more mock predictions...
];

export default function SocialFeedScreen() {
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedFilter, setFeedFilter] = useState<'following' | 'trending'>('following');

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleUserPress = (userId: string) => {
    // Navigate to user profile
    navigation.navigate('UserProfile', { userId });
  };

  const handlePredictionPress = (predictionId: string) => {
    // Navigate to prediction details
    navigation.navigate('PredictionDetails', { predictionId });
  };

  const handleLikePress = (predictionId: string) => {
    // Implement like functionality
    console.log('Like pressed for prediction:', predictionId);
  };

  const handleCommentPress = (predictionId: string) => {
    // Navigate to comments screen
    navigation.navigate('Comments', { predictionId });
  };

  const handleSharePress = (predictionId: string) => {
    // Implement share functionality
    console.log('Share pressed for prediction:', predictionId);
  };

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Predictions Feed</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              feedFilter === 'following' && styles.activeFilter,
            ]}
            onPress={() => setFeedFilter('following')}
          >
            <Ionicons
              name="people"
              size={20}
              color={
                feedFilter === 'following'
                  ? colors.text.light
                  : colors.text.secondary
              }
            />
            <Text
              style={[
                styles.filterText,
                feedFilter === 'following' && styles.activeFilterText,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              feedFilter === 'trending' && styles.activeFilter,
            ]}
            onPress={() => setFeedFilter('trending')}
          >
            <Ionicons
              name="trending-up"
              size={20}
              color={
                feedFilter === 'trending'
                  ? colors.text.light
                  : colors.text.secondary
              }
            />
            <Text
              style={[
                styles.filterText,
                feedFilter === 'trending' && styles.activeFilterText,
              ]}
            >
              Trending
            </Text>
          </TouchableOpacity>
        </View>

        <PredictionFeed
          predictions={mockPredictions}
          onUserPress={handleUserPress}
          onPredictionPress={handlePredictionPress}
          onLikePress={handleLikePress}
          onCommentPress={handleCommentPress}
          onSharePress={handleSharePress}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.text.primary}
            />
          }
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreatePrediction')}
        >
          <Ionicons name="add" size={24} color={colors.text.light} />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: colors.text.light,
    fontWeight: '500',
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
