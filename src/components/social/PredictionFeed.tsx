import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface PredictionPost {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  match: {
    homeTeam: {
      name: string;
      logo: string;
    };
    awayTeam: {
      name: string;
      logo: string;
    };
    date: string;
    league: string;
  };
  prediction: {
    winner: 'home' | 'away' | 'draw';
    confidence: number;
    analysis: string;
    timestamp: string;
  };
  social: {
    likes: number;
    comments: number;
    hasLiked: boolean;
  };
}

interface PredictionFeedProps {
  predictions: PredictionPost[];
  onUserPress: (userId: string) => void;
  onPredictionPress: (predictionId: string) => void;
  onLikePress: (predictionId: string) => void;
  onCommentPress: (predictionId: string) => void;
  onSharePress: (predictionId: string) => void;
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
}) => (
  <GlassmorphicCard style={styles.postCard}>
    <TouchableOpacity
      style={styles.userHeader}
      onPress={() => onUserPress(post.user.id)}
    >
      <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{post.user.username}</Text>
          {post.user.verified && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.status.success}
              style={styles.verifiedBadge}
            />
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(post.prediction.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.matchContainer}
      onPress={() => onPredictionPress(post.id)}
    >
      <View style={styles.teamContainer}>
        <Image source={{ uri: post.match.homeTeam.logo }} style={styles.teamLogo} />
        <Text style={styles.teamName}>{post.match.homeTeam.name}</Text>
      </View>
      <View style={styles.matchInfo}>
        <Text style={styles.leagueName}>{post.match.league}</Text>
        <Text style={styles.vsText}>vs</Text>
        <Text style={styles.matchDate}>
          {new Date(post.match.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.teamContainer}>
        <Image source={{ uri: post.match.awayTeam.logo }} style={styles.teamLogo} />
        <Text style={styles.teamName}>{post.match.awayTeam.name}</Text>
      </View>
    </TouchableOpacity>

    <View style={styles.predictionContainer}>
      <View style={styles.predictionHeader}>
        <Text style={styles.predictionLabel}>Prediction</Text>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceValue}>
            {post.prediction.confidence}% Confident
          </Text>
          <View
            style={[
              styles.confidenceBar,
              { width: `${post.prediction.confidence}%` },
            ]}
          />
        </View>
      </View>
      <Text style={styles.predictionText}>
        {post.prediction.winner === 'home'
          ? post.match.homeTeam.name
          : post.prediction.winner === 'away'
          ? post.match.awayTeam.name
          : 'Draw'}{' '}
        to {post.prediction.winner === 'draw' ? 'happen' : 'win'}
      </Text>
      <Text style={styles.analysisText}>{post.prediction.analysis}</Text>
    </View>

    <View style={styles.socialActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onLikePress(post.id)}
      >
        <Ionicons
          name={post.social.hasLiked ? 'heart' : 'heart-outline'}
          size={24}
          color={post.social.hasLiked ? colors.status.error : colors.text.secondary}
        />
        <Text style={styles.actionText}>{post.social.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onCommentPress(post.id)}
      >
        <Ionicons name="chatbubble-outline" size={24} color={colors.text.secondary} />
        <Text style={styles.actionText}>{post.social.comments}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onSharePress(post.id)}
      >
        <Ionicons name="share-outline" size={24} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  </GlassmorphicCard>
);

export default function PredictionFeed({
  predictions,
  onUserPress,
  onPredictionPress,
  onLikePress,
  onCommentPress,
  onSharePress,
}: PredictionFeedProps) {
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
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginRight: 4,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'center',
  },
  matchInfo: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  leagueName: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  vsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  predictionContainer: {
    marginBottom: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceValue: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  confidenceBar: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  predictionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  socialActions: {
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
    color: colors.text.secondary,
  },
});
