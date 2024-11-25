import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserProfileCard from '../../components/social/UserProfileCard';
import PredictionFeed from '../../components/social/PredictionFeed';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';

// Mock data - Replace with actual API calls
const mockUserData = {
  id: 'user1',
  username: 'JohnDoe',
  avatar: 'https://example.com/avatar1.jpg',
  verified: true,
  bio: 'Sports enthusiast | Premier League expert | 85% prediction accuracy',
  stats: {
    predictions: 156,
    followers: 1234,
    following: 891,
    accuracy: 85,
  },
  achievements: [
    {
      id: '1',
      icon: '🎯',
      title: 'Accuracy Master',
      description: 'Maintained 80%+ accuracy for 3 months',
    },
    {
      id: '2',
      icon: '🔥',
      title: 'Hot Streak',
      description: '10 correct predictions in a row',
    },
    {
      id: '3',
      icon: '👑',
      title: 'League Champion',
      description: 'Top predictor in Premier League',
    },
  ],
  topLeagues: [
    {
      id: '1',
      name: 'Premier League',
      accuracy: 88,
      predictions: 45,
    },
    {
      id: '2',
      name: 'La Liga',
      accuracy: 82,
      predictions: 38,
    },
    {
      id: '3',
      name: 'Champions League',
      accuracy: 79,
      predictions: 24,
    },
  ],
};

const mockPredictions = [
  // ... (use the same mock predictions from SocialFeedScreen)
];

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'predictions' | 'stats'>('predictions');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleFollowPress = () => {
    // Implement follow/unfollow functionality
    setIsFollowing(!isFollowing);
  };

  const handleSharePress = () => {
    // Implement share functionality
    console.log('Share profile:', mockUserData.id);
  };

  const handleMessagePress = () => {
    // Navigate to chat screen
    navigation.navigate('Chat', { userId: mockUserData.id });
  };

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSharePress}
          >
            <Ionicons name="share-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.text.primary}
            />
          }
        >
          <UserProfileCard
            user={mockUserData}
            isFollowing={isFollowing}
            onFollowPress={handleFollowPress}
            onMessagePress={handleMessagePress}
          />

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'predictions' && styles.activeTab,
              ]}
              onPress={() => setSelectedTab('predictions')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'predictions' && styles.activeTabText,
                ]}
              >
                Predictions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'stats' && styles.activeTab]}
              onPress={() => setSelectedTab('stats')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'stats' && styles.activeTabText,
                ]}
              >
                Stats & Achievements
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'predictions' ? (
            <PredictionFeed
              predictions={mockPredictions}
              onUserPress={() => {}}
              onPredictionPress={(predictionId) =>
                navigation.navigate('PredictionDetails', { predictionId })
              }
              onLikePress={(predictionId) =>
                console.log('Like pressed:', predictionId)
              }
              onCommentPress={(predictionId) =>
                navigation.navigate('Comments', { predictionId })
              }
              onSharePress={(predictionId) =>
                console.log('Share pressed:', predictionId)
              }
            />
          ) : (
            <View style={styles.statsContainer}>
              <GlassmorphicCard style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Top Leagues</Text>
                {mockUserData.topLeagues.map((league) => (
                  <View key={league.id} style={styles.leagueItem}>
                    <Text style={styles.leagueName}>{league.name}</Text>
                    <View style={styles.leagueStats}>
                      <Text style={styles.leagueStat}>
                        {league.accuracy}% accuracy
                      </Text>
                      <Text style={styles.leagueStat}>
                        {league.predictions} predictions
                      </Text>
                    </View>
                  </View>
                ))}
              </GlassmorphicCard>

              <GlassmorphicCard style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {mockUserData.achievements.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementTitle}>
                        {achievement.title}
                      </Text>
                      <Text style={styles.achievementDescription}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </GlassmorphicCard>
            </View>
          )}
        </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.light,
    fontWeight: '500',
  },
  statsContainer: {
    padding: 16,
    gap: 16,
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  leagueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leagueName: {
    fontSize: 16,
    color: colors.text.primary,
  },
  leagueStats: {
    alignItems: 'flex-end',
  },
  leagueStat: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
