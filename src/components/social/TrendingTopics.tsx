import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface TrendingTopic {
  id: string;
  title: string;
  type: 'match' | 'tournament' | 'team';
  image: string;
  stats: {
    predictions: number;
    accuracy: number;
  };
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  onTopicPress: (topicId: string) => void;
}

export const TrendingTopics = ({ topics, onTopicPress }: TrendingTopicsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            onPress={() => onTopicPress(topic.id)}
            style={styles.topicContainer}
          >
            <GlassmorphicCard style={styles.topicCard}>
              <Image source={{ uri: topic.image }} style={styles.topicImage} />
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.stat}>
                    <Ionicons name="analytics-outline" size={14} color={colors.primary} />
                    <Text style={styles.statText}>{topic.stats.predictions}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={topic.stats.accuracy > 70 ? colors.success : colors.warning} />
                    <Text style={styles.statText}>{topic.stats.accuracy}%</Text>
                  </View>
                </View>
              </View>
            </GlassmorphicCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  topicContainer: {
    width: 200,
  },
  topicCard: {
    padding: 0,
    overflow: 'hidden',
  },
  topicImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  topicInfo: {
    padding: 12,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
