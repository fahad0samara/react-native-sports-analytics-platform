import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import PredictionFeed from '../../components/social/PredictionFeed';
import { PredictionPost } from '../../types/prediction';

interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  verified: boolean;
  bio: string;
  stats: {
    predictions: number;
    followers: number;
    following: number;
    accuracy: number;
  };
}

export const UserProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [predictions, setPredictions] = useState<PredictionPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);

  const fetchProfile = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setProfile({
        id: userId,
        username: 'JohnDoe',
        avatar: 'https://example.com/avatar1.jpg',
        verified: true,
        bio: 'Sports analyst and enthusiast. Making predictions based on data and intuition.',
        stats: {
          predictions: 156,
          followers: 1234,
          following: 567,
          accuracy: 78,
        },
      });

      setPredictions([
        // Mock predictions...
      ]);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setFollowing(!following);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundDark]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.profileHeader}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{profile.username}</Text>
              {profile.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
              )}
            </View>
            <Text style={styles.bio}>{profile.bio}</Text>

            <TouchableOpacity
              style={[styles.followButton, following && styles.followingButton]}
              onPress={handleFollow}
              disabled={loading}
            >
              <Text style={styles.followButtonText}>
                {following ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{profile.stats.predictions}</Text>
              <Text style={styles.statLabel}>Predictions</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{profile.stats.accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{profile.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <Text style={styles.statValue}>{profile.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </GlassmorphicCard>
          </View>

          <View style={styles.predictionsFeed}>
            <Text style={styles.sectionTitle}>Predictions</Text>
            <PredictionFeed
              predictions={predictions}
              onUserPress={() => {}}
              onPredictionPress={(predictionId) =>
                navigation.navigate('PredictionDetails', { predictionId })
              }
              onLikePress={(predictionId) => {}}
              onCommentPress={(predictionId) =>
                navigation.navigate('Comments', { predictionId })
              }
              onSharePress={(predictionId) => {}}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  bio: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '40%',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  predictionsFeed: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
});
