import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { PredictionPost } from '../../types/prediction';

interface PredictionFeedProps {
  predictions: PredictionPost[];
  onUserPress: (userId: string) => void;
  onPredictionPress: (predictionId: string) => void;
  onLikePress: (predictionId: string) => void;
  onCommentPress: (predictionId: string) => void;
  onSharePress: (predictionId: string) => void;
  refreshControl?: React.ReactElement;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?: React.ReactElement;
}

const PredictionPostCard = ({
  post,
  onUserPress,
  onPredictionPress,
  onLikePress,
  onCommentPress,
  onSharePress,
}: {
  post: PredictionPost;
  onUserPress: (userId: string) => void;
  onPredictionPress: (predictionId: string) => void;
  onLikePress: (predictionId: string) => void;
  onCommentPress: (predictionId: string) => void;
  onSharePress: (predictionId: string) => void;
}) => {
  const formattedDate = new Date(post.match.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <GlassmorphicCard style={styles.card}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => onUserPress(post.user.id)}
      >
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userTextContainer}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{post.user.username}</Text>
            {post.user.verified && (
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            )}
          </View>
          <Text style={styles.timestamp}>
            {new Date(post.prediction.timestamp).toRelativeTimeString()}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.matchInfo}
        onPress={() => onPredictionPress(post.id)}
      >
        <View style={styles.teamContainer}>
          <Image source={{ uri: post.match.homeTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{post.match.homeTeam.name}</Text>
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>vs</Text>
          <Text style={styles.matchDate}>{formattedDate}</Text>
          <Text style={styles.leagueText}>{post.match.league}</Text>
        </View>
        <View style={styles.teamContainer}>
          <Image source={{ uri: post.match.awayTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{post.match.awayTeam.name}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.predictionContainer}>
        <View style={styles.predictionHeader}>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <Text style={styles.confidenceValue}>{post.prediction.confidence}%</Text>
          </View>
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerLabel}>Prediction</Text>
            <Text style={styles.winnerValue}>
              {post.prediction.winner === 'home'
                ? post.match.homeTeam.name
                : post.prediction.winner === 'away'
                ? post.match.awayTeam.name
                : 'Draw'}
            </Text>
          </View>
        </View>
        <Text style={styles.analysis}>{post.prediction.analysis}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLikePress(post.id)}
        >
          <Ionicons
            name={post.userInteraction.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={post.userInteraction.liked ? colors.primary : colors.text}
          />
          <Text style={styles.actionText}>{post.stats.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onCommentPress(post.id)}
        >
          <Ionicons
            name={post.userInteraction.commented ? 'chatbubble' : 'chatbubble-outline'}
            size={24}
            color={post.userInteraction.commented ? colors.primary : colors.text}
          />
          <Text style={styles.actionText}>{post.stats.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSharePress(post.id)}
        >
          <Ionicons
            name={post.userInteraction.shared ? 'share-social' : 'share-social-outline'}
            size={24}
            color={post.userInteraction.shared ? colors.primary : colors.text}
          />
          <Text style={styles.actionText}>{post.stats.shares}</Text>
        </TouchableOpacity>
      </View>
    </GlassmorphicCard>
  );
};

const PredictionFeed: React.FC<PredictionFeedProps> = ({
  predictions,
  onUserPress,
  onPredictionPress,
  onLikePress,
  onCommentPress,
  onSharePress,
  refreshControl,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
}) => {
  return (
    <FlatList
      data={predictions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PredictionPostCard
          post={item}
          onUserPress={onUserPress}
          onPredictionPress={onPredictionPress}
          onLikePress={onLikePress}
          onCommentPress={onCommentPress}
          onSharePress={onSharePress}
        />
      )}
      contentContainerStyle={styles.container}
      refreshControl={refreshControl}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    gap: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userTextContainer: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    gap: 4,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  matchDate: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  leagueText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  predictionContainer: {
    gap: 12,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  confidenceContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  confidenceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  winnerContainer: {
    flex: 2,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  winnerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  winnerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  analysis: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default PredictionFeed;
