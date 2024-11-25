import React from 'react';
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

export default function PredictionStatsScreen() {
  const navigation = useNavigation<PredictionStatsScreenNavigationProp>();
  const predictions = useSelector((state: RootState) => state.predictions.userPredictions);

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
          <Text style={styles.headerTitle}>Prediction Statistics</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
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
});
