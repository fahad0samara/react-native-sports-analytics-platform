import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';

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
  likes: number;
  hasLiked: boolean;
  replies?: Comment[];
}

// Mock data - Replace with actual API calls
const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'JohnDoe',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true,
    },
    content: 'Great analysis! I completely agree with your prediction.',
    timestamp: '2024-02-19T12:00:00Z',
    likes: 24,
    hasLiked: false,
    replies: [
      {
        id: '1.1',
        user: {
          id: 'user2',
          username: 'JaneSmith',
          avatar: 'https://example.com/avatar2.jpg',
        },
        content: 'The home advantage will definitely be a crucial factor!',
        timestamp: '2024-02-19T12:30:00Z',
        likes: 8,
        hasLiked: false,
      },
    ],
  },
  // Add more mock comments...
];

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
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.status.success}
              style={styles.verifiedBadge}
            />
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(comment.timestamp).toLocaleDateString()}
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
          name={comment.hasLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={comment.hasLiked ? colors.status.error : colors.text.secondary}
        />
        <Text style={styles.actionText}>{comment.likes}</Text>
      </TouchableOpacity>
      {!isReply && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onReplyPress(comment)}
        >
          <Ionicons name="return-down-forward" size={20} color={colors.text.secondary} />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>

    {comment.replies && comment.replies.length > 0 && (
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

export default function CommentsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleLikePress = (commentId: string) => {
    // Implement like functionality
    console.log('Like pressed for comment:', commentId);
  };

  const handleReplyPress = (comment: Comment) => {
    setReplyingTo(comment);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Implement comment submission
      console.log('Submitting comment:', {
        content: newComment,
        replyTo: replyingTo?.id,
      });
      setNewComment('');
      setReplyingTo(null);
    }
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
          <Text style={styles.title}>Comments</Text>
          <View style={styles.placeholder} />
        </View>

        <FlatList
          data={mockComments}
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
                <Ionicons name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={colors.text.secondary}
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
                color={
                  newComment.trim() ? colors.text.light : colors.text.secondary
                }
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  commentsList: {
    padding: 16,
    gap: 16,
  },
  commentCard: {
    padding: 16,
  },
  replyCard: {
    marginLeft: 32,
    marginTop: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  commentContent: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 12,
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
    color: colors.text.secondary,
  },
  repliesContainer: {
    marginTop: 8,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  replyingToText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: colors.text.primary,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
