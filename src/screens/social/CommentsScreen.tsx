import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { predictionService } from '../../services/predictionService';

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    likes: number;
  };
  userInteraction: {
    liked: boolean;
  };
  replies?: Comment[];
}

const CommentItem = ({
  comment,
  onUserPress,
  onLikePress,
  onReplyPress,
  isReply = false,
}: {
  comment: Comment;
  onUserPress: (userId: string) => void;
  onLikePress: (commentId: string) => void;
  onReplyPress: (comment: Comment) => void;
  isReply?: boolean;
}) => (
  <GlassmorphicCard style={[styles.commentCard, isReply && styles.replyCard]}>
    <TouchableOpacity
      style={styles.commentHeader}
      onPress={() => onUserPress(comment.user.id)}
    >
      <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{comment.user.username}</Text>
          {comment.user.verified && (
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(comment.timestamp).toRelativeTimeString()}
        </Text>
      </View>
    </TouchableOpacity>

    <Text style={styles.commentContent}>{comment.content}</Text>

    <View style={styles.commentActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onLikePress(comment.id)}
      >
        <Ionicons
          name={comment.userInteraction.liked ? 'heart' : 'heart-outline'}
          size={20}
          color={comment.userInteraction.liked ? colors.primary : colors.text}
        />
        <Text style={styles.actionText}>{comment.stats.likes}</Text>
      </TouchableOpacity>

      {!isReply && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onReplyPress(comment)}
        >
          <Ionicons name="return-down-forward-outline" size={20} color={colors.text} />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>

    {comment.replies && (
      <View style={styles.repliesContainer}>
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            onUserPress={onUserPress}
            onLikePress={onLikePress}
            onReplyPress={onReplyPress}
            isReply
          />
        ))}
      </View>
    )}
  </GlassmorphicCard>
);

export const CommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const predictionId = route.params?.predictionId;

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async (pageNum: number, refresh: boolean = false) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await predictionService.getComments(predictionId, pageNum);
      setComments(prev => refresh ? response.comments : [...prev, ...response.comments]);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchComments(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleLikePress = async (commentId: string) => {
    try {
      await predictionService.likeComment(commentId);
      // Optimistically update UI
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? {
                ...c,
                stats: {
                  ...c.stats,
                  likes: c.userInteraction.liked ? c.stats.likes - 1 : c.stats.likes + 1,
                },
                userInteraction: {
                  ...c.userInteraction,
                  liked: !c.userInteraction.liked,
                },
              }
            : c
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplyPress = (comment: Comment) => {
    setReplyingTo(comment);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await predictionService.createComment({
        predictionId,
        content: newComment,
        replyToId: replyingTo?.id,
      });

      if (replyingTo) {
        setComments(prev =>
          prev.map(c =>
            c.id === replyingTo.id
              ? {
                  ...c,
                  replies: [...(c.replies || []), comment],
                }
              : c
          )
        );
      } else {
        setComments(prev => [comment, ...prev]);
      }

      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  useEffect(() => {
    fetchComments(1, true);
  }, [predictionId]);

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
          <Text style={styles.title}>Comments</Text>
          <View style={styles.backButton} />
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              onUserPress={handleUserPress}
              onLikePress={handleLikePress}
              onReplyPress={handleReplyPress}
            />
          )}
          contentContainerStyle={styles.commentsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && !refreshing ? (
              <View style={styles.loader}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.inputContainer}
        >
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={styles.replyingToText}>
                Replying to {replyingTo.user.username}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !newComment.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={newComment.trim() ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  commentsList: {
    padding: 16,
    gap: 16,
  },
  commentCard: {
    padding: 16,
    gap: 12,
  },
  replyCard: {
    marginLeft: 32,
    marginTop: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  repliesContainer: {
    marginTop: 8,
    gap: 8,
  },
  loader: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    gap: 8,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  replyingToText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 48,
    color: colors.text,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
