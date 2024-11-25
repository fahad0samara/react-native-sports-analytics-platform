import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface User {
  id: string;
  username: string;
  avatar: string;
  verified?: boolean;
  bio: string;
  stats: {
    predictions: number;
    followers: number;
    following: number;
    accuracy: number;
  };
}

interface UserProfileCardProps {
  user: User;
  isFollowing: boolean;
  onFollowPress: () => void;
  onMessagePress: () => void;
}

export default function UserProfileCard({
  user,
  isFollowing,
  onFollowPress,
  onMessagePress,
}: UserProfileCardProps) {
  return (
    <GlassmorphicCard style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {user.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <Text style={styles.bio} numberOfLines={3}>
            {user.bio}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.predictions}</Text>
          <Text style={styles.statLabel}>Predictions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.accuracyContainer}>
        <Text style={styles.accuracyLabel}>Prediction Accuracy</Text>
        <View style={styles.accuracyBar}>
          <LinearGradient
            colors={[colors.primary, colors.status.success]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.accuracyFill, { width: `${user.stats.accuracy}%` }]}
          />
          <Text style={styles.accuracyValue}>{user.stats.accuracy}%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.followButton, isFollowing && styles.followingButton]}
          onPress={onFollowPress}
        >
          <Text style={[styles.actionButtonText, isFollowing && styles.followingButtonText]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={onMessagePress}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.text.light} />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
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
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  accuracyContainer: {
    marginBottom: 16,
  },
  accuracyLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  accuracyBar: {
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  accuracyFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 12,
  },
  accuracyValue: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.light,
    textAlignVertical: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 20,
  },
  followButton: {
    backgroundColor: colors.primary,
  },
  followingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.light,
  },
  followingButtonText: {
    color: colors.text.primary,
  },
});
