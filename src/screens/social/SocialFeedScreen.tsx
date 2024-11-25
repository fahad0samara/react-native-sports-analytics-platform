import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PredictionFeed from '../../components/social/PredictionFeed';
import { predictionService } from '../../services/predictionService';
import { PredictionPost } from '../../types/prediction';
import { Share } from 'react-native';

export const SocialFeedScreen = () => {
  const navigation = useNavigation();
  const [predictions, setPredictions] = useState<PredictionPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPredictions = async (pageNum: number, refresh: boolean = false) => {
    try {
      setLoading(true);
      const { predictions: newPredictions, hasMore: more } = await predictionService.fetchPredictions(pageNum);
      
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPredictions(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPredictions(nextPage);
    }
  };

  const handleUserPress = (userId: string) => {
    // TODO: Navigate to user profile
    navigation.navigate('UserProfile', { userId });
  };

  const handlePredictionPress = (predictionId: string) => {
    // TODO: Navigate to prediction details
    navigation.navigate('PredictionDetails', { predictionId });
  };

  const handleLikePress = async (predictionId: string) => {
    try {
      await predictionService.likePrediction(predictionId);
      // Optimistically update UI
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
      // TODO: Show error toast
    }
  };

  const handleCommentPress = (predictionId: string) => {
    navigation.navigate('Comments', { predictionId });
  };

  const handleSharePress = async (predictionId: string) => {
    try {
      const prediction = predictions.find(p => p.id === predictionId);
      if (!prediction) return;

      const result = await Share.share({
        message: `Check out this prediction for ${prediction.match.homeTeam.name} vs ${prediction.match.awayTeam.name}!`,
        // TODO: Add your app's deep link
        url: `https://yourapp.com/predictions/${predictionId}`,
      });

      if (result.action === Share.sharedAction) {
        await predictionService.sharePrediction(predictionId);
        // Optimistically update UI
        setPredictions(prev =>
          prev.map(p =>
            p.id === predictionId
              ? {
                  ...p,
                  stats: {
                    ...p.stats,
                    shares: p.stats.shares + 1,
                  },
                  userInteraction: {
                    ...p.userInteraction,
                    shared: true,
                  },
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error sharing prediction:', error);
      // TODO: Show error toast
    }
  };

  useEffect(() => {
    fetchPredictions(1, true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundDark]}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <PredictionFeed
          predictions={predictions}
          onUserPress={handleUserPress}
          onPredictionPress={handlePredictionPress}
          onLikePress={handleLikePress}
          onCommentPress={handleCommentPress}
          onSharePress={handleSharePress}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchButton: {
    padding: 8,
  },
  loader: {
    padding: 16,
    alignItems: 'center',
  },
});
