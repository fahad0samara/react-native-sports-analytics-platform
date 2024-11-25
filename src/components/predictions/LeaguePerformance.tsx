import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface LeagueStats {
  leagueName: string;
  correct: number;
  incorrect: number;
  pending: number;
  totalPredictions: number;
  accuracy: number;
  averageConfidence: number;
}

interface LeaguePerformanceProps {
  stats: LeagueStats;
}

const screenWidth = Dimensions.get('window').width;

export default function LeaguePerformance({ stats }: LeaguePerformanceProps) {
  const chartData = [
    {
      name: 'Correct',
      population: stats.correct,
      color: colors.status.success,
      legendFontColor: colors.text.primary,
    },
    {
      name: 'Incorrect',
      population: stats.incorrect,
      color: colors.status.error,
      legendFontColor: colors.text.primary,
    },
    {
      name: 'Pending',
      population: stats.pending,
      color: colors.status.warning,
      legendFontColor: colors.text.primary,
    },
  ];

  return (
    <GlassmorphicCard style={styles.container}>
      <Text style={styles.title}>{stats.leagueName}</Text>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalPredictions}</Text>
          <Text style={styles.statLabel}>Total Predictions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.status.success }]}>
            {(stats.accuracy * 100).toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {stats.averageConfidence.toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Avg. Confidence</Text>
        </View>
      </View>

      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: colors.status.success }]} />
          <Text style={styles.breakdownLabel}>Correct</Text>
          <Text style={styles.breakdownValue}>{stats.correct}</Text>
        </View>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: colors.status.error }]} />
          <Text style={styles.breakdownLabel}>Incorrect</Text>
          <Text style={styles.breakdownValue}>{stats.incorrect}</Text>
        </View>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: colors.status.warning }]} />
          <Text style={styles.breakdownLabel}>Pending</Text>
          <Text style={styles.breakdownValue}>{stats.pending}</Text>
        </View>
      </View>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
  },
});
