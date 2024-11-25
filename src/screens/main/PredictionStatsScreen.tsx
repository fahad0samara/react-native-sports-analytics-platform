import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PredictionsStackParamList } from '../../navigation/types';
import { Prediction } from '../../types';
import PredictionTrends from '../../components/predictions/PredictionTrends';
import LeaguePerformance from '../../components/predictions/LeaguePerformance';
import StreaksAndAchievements from '../../components/predictions/StreaksAndAchievements';

type PredictionStatsScreenNavigationProp = NativeStackNavigationProp<
  PredictionsStackParamList,
  'PredictionStats'
>;

const { width: screenWidth } = Dimensions.get('window');

const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
  <GlassmorphicCard style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </GlassmorphicCard>
);

const timeRangeOptions = ['1W', '1M', '3M', 'All'] as const;
type TimeRange = typeof timeRangeOptions[number];

const mockLeagueStats = {
  leagueName: 'Premier League',
  correct: 25,
  incorrect: 10,
  pending: 5,
  totalPredictions: 40,
  accuracy: 0.714,
  averageConfidence: 75.5,
};

const mockStreaks = {
  currentStreak: {
    type: 'current' as const,
    count: 5,
    startDate: '2024-01-15',
  },
  bestStreak: {
    type: 'best' as const,
    count: 8,
    startDate: '2023-12-01',
    endDate: '2023-12-15',
  },
};

const mockAchievements = [
  {
    title: 'Prediction Master',
    description: 'Make 100 correct predictions',
    icon: 'trophy',
    progress: 75,
    target: 100,
    completed: false,
  },
  {
    title: 'Hot Streak',
    description: 'Achieve a streak of 10 correct predictions',
    icon: 'flame',
    progress: 8,
    target: 10,
    completed: false,
  },
  {
    title: 'League Expert',
    description: 'Maintain 80% accuracy in a league',
    icon: 'medal',
    progress: 80,
    target: 80,
    completed: true,
  },
];

export default function PredictionStatsScreen() {
  const navigation = useNavigation<PredictionStatsScreenNavigationProp>();
  const predictions = useSelector((state: RootState) => state.predictions.userPredictions);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1M');

  const calculateStats = (predictions: Prediction[]) => {
    const total = predictions.length;
    if (total === 0) {
      return {
        totalPredictions: 0,
        correctPredictions: 0,
        incorrectPredictions: 0,
        pendingPredictions: 0,
        accuracy: 0,
        avgConfidence: 0,
        streak: 0,
        bestStreak: 0,
      };
    }

    const correctPredictions = predictions.filter(p => p.isCorrect === true).length;
    const incorrectPredictions = predictions.filter(p => p.isCorrect === false).length;
    const pendingPredictions = predictions.filter(p => p.isCorrect === undefined).length;
    const accuracy = (correctPredictions / (correctPredictions + incorrectPredictions)) * 100;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / total;

    // Calculate current and best streak
    let currentStreak = 0;
    let bestStreak = 0;
    let streak = 0;

    // Sort predictions by date
    const sortedPredictions = [...predictions]
      .filter(p => p.isCorrect !== undefined)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (const prediction of sortedPredictions) {
      if (prediction.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    streak = currentStreak;

    return {
      totalPredictions: total,
      correctPredictions,
      incorrectPredictions,
      pendingPredictions,
      accuracy,
      avgConfidence,
      streak,
      bestStreak,
    };
  };

  const stats = calculateStats(predictions as Prediction[]);

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
          <Text style={styles.title}>Prediction Statistics</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.timeRangeContainer}>
          {timeRangeOptions.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range && styles.selectedTimeRange,
              ]}
              onPress={() => setSelectedTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  selectedTimeRange === range && styles.selectedTimeRangeText,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <PredictionTrends timeRange={selectedTimeRange} />
          
          <View style={styles.spacing} />
          
          <LeaguePerformance stats={mockLeagueStats} />
          
          <View style={styles.spacing} />
          
          <StreaksAndAchievements
            currentStreak={mockStreaks.currentStreak}
            bestStreak={mockStreaks.bestStreak}
            achievements={mockAchievements}
          />
          
          <View style={styles.spacing} />
          
          <View style={styles.mainStats}>
            <StatCard
              title="Accuracy"
              value={`${stats.accuracy.toFixed(1)}%`}
              subtitle={`${stats.correctPredictions} correct out of ${stats.correctPredictions + stats.incorrectPredictions}`}
            />
            <StatCard
              title="Avg. Confidence"
              value={`${stats.avgConfidence.toFixed(1)}%`}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Total Predictions"
              value={stats.totalPredictions}
            />
            <StatCard
              title="Current Streak"
              value={stats.streak}
            />
            <StatCard
              title="Best Streak"
              value={stats.bestStreak}
            />
            <StatCard
              title="Pending"
              value={stats.pendingPredictions}
            />
          </View>

          <GlassmorphicCard style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Prediction Breakdown</Text>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLabel}>
                <View style={[styles.dot, { backgroundColor: colors.status.success }]} />
                <Text style={styles.breakdownText}>Correct</Text>
              </View>
              <Text style={styles.breakdownValue}>{stats.correctPredictions}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLabel}>
                <View style={[styles.dot, { backgroundColor: colors.status.error }]} />
                <Text style={styles.breakdownText}>Incorrect</Text>
              </View>
              <Text style={styles.breakdownValue}>{stats.incorrectPredictions}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLabel}>
                <View style={[styles.dot, { backgroundColor: colors.text.secondary }]} />
                <Text style={styles.breakdownText}>Pending</Text>
              </View>
              <Text style={styles.breakdownValue}>{stats.pendingPredictions}</Text>
            </View>
          </GlassmorphicCard>
        </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedTimeRange: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  selectedTimeRangeText: {
    color: colors.text.light,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  mainStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    padding: 16,
    flex: 1,
    minWidth: (screenWidth - 48) / 2,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  breakdownCard: {
    padding: 16,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  spacing: {
    height: 16,
  },
});
