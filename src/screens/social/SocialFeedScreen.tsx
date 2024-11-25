import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PredictionFeed from '../../components/social/PredictionFeed';
import { TrendingTopics } from '../../components/social/TrendingTopics';
import { SearchFilters } from '../../components/social/SearchFilters';
import { predictionService } from '../../services/predictionService';
import { PredictionPost } from '../../types/prediction';

export const SocialFeedScreen = () => {
  const navigation = useNavigation();
  const [predictions, setPredictions] = useState<PredictionPost[]>([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fetchPredictions = async (pageNum: number, refresh: boolean = false) => {
    try {
      setLoading(true);
      const { predictions: newPredictions, hasMore: more } = await predictionService.fetchPredictions(pageNum, {
        search: searchQuery,
        filters: activeFilters,
      });
      
      setPredictions(prev => refresh ? newPredictions : [...prev, ...newPredictions]);
      setHasMore(more);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const topics = await predictionService.getTrendingTopics();
      setTrendingTopics(topics);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPredictions(1, true);
    fetchTrendingTopics();
  }, [searchQuery, activeFilters]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPredictions(nextPage);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    fetchPredictions(1, true);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    setPage(1);
    fetchPredictions(1, true);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handlePredictionPress = (predictionId: string) => {
    navigation.navigate('PredictionDetails', { predictionId });
  };

  const handleLikePress = async (predictionId: string) => {
    try {
      await predictionService.likePrediction(predictionId);
      setPredictions(prev =>
        prev.map(p =>
          p.id === predictionId
            ? {
                ...p,
                stats: {
                  ...p.stats,
                  likes: p.userInteraction.liked ? p.stats.likes - 1 : p.stats.likes + 1,
                },
                userInteraction: {
                  ...p.userInteraction,
                  liked: !p.userInteraction.liked,
                },
              }
            : p
        )
      );
    } catch (error) {
      console.error('Error liking prediction:', error);
    }
  };

  const handleCommentPress = (predictionId: string) => {
    navigation.navigate('Comments', { predictionId });
  };

  const handleSharePress = async (predictionId: string) => {
    try {
      const prediction = predictions.find(p => p.id === predictionId);
      if (!prediction) return;

      const shareMessage = `Check out this prediction for ${prediction.match.homeTeam.name} vs ${prediction.match.awayTeam.name}!\n\nhttps://yourapp.com/predictions/${predictionId}`;
      
      await Share.share({
        message: shareMessage,
        title: 'Share Prediction',
      });

      await predictionService.sharePrediction(predictionId);
      setPredictions(prev =>
        prev.map(p =>
          p.id === predictionId
            ? {
                ...p,
                stats: {
                  ...p.stats,
                  shares: p.stats.shares + 1,
                },
              }
            : p
        )
      );
    } catch (error) {
      console.error('Error sharing prediction:', error);
    }
  };

  const handleTopicPress = (topicId: string) => {
    navigation.navigate('TopicDetails', { topicId });
  };

  useEffect(() => {
    fetchPredictions(1, true);
    fetchTrendingTopics();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundDark]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreatePrediction')}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <SearchFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        <TrendingTopics
          topics={trendingTopics}
          onTopicPress={handleTopicPress}
        />

        <PredictionFeed
          predictions={predictions}
          onUserPress={handleUserPress}
          onPredictionPress={handlePredictionPress}
          onLikePress={handleLikePress}
          onCommentPress={handleCommentPress}
          onSharePress={handleSharePress}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    padding: 16,
    alignItems: 'center',
  },
});
