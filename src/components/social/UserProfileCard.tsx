import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UserStats {
  totalPredictions: number;
  accuracy: number;
  currentStreak: number;
  followers: number;
  following: number;
}

interface UserProfileCardProps {
  userId: string;
  username: string;
  avatar: string;
  bio: string;
  stats: UserStats;
  isFollowing: boolean;
  onFollowPress: () => void;
  onProfilePress: () => void;
  verified?: boolean;
}

export default function UserProfileCard({
  username,
  avatar,
  bio,
  stats,
  isFollowing,
  onFollowPress,
  onProfilePress,
  verified,
}: UserProfileCardProps) {
  return (
    <GlassmorphicCard style={styles.container}>
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            {verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{username}</Text>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followingButton,
                ]}
                onPress={onFollowPress}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bio} numberOfLines={2}>
              {bio}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalPredictions}</Text>
            <Text style={styles.statLabel}>Predictions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(stats.accuracy * 100).toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        <View style={styles.socialStats}>
          <View style={styles.socialStatItem}>
            <Text style={styles.socialStatValue}>{stats.followers}</Text>
            <Text style={styles.socialStatLabel}>Followers</Text>
          </View>
          <View style={styles.socialStatDivider} />
          <View style={styles.socialStatItem}>
            <Text style={styles.socialStatValue}>{stats.following}</Text>
            <Text style={styles.socialStatLabel}>Following</Text>
          </View>
        </View>

        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.performanceBar}
        >
          <View
            style={[
              styles.performanceFill,
              { width: `${stats.accuracy * 100}%` },
            ]}
          />
        </LinearGradient>
      </TouchableOpacity>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: 12,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 2,
  },
  userInfo: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  followingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.light,
  },
  followingButtonText: {
    color: colors.text.primary,
  },
  bio: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  socialStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialStatItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  socialStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  socialStatValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  socialStatLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  performanceBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
    backgroundColor: colors.status.success,
  },
});
