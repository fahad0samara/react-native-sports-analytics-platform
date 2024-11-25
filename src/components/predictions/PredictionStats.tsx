import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Prediction } from '../../types';

interface PredictionStatsProps {
  predictions: Prediction[];
}

export default function PredictionStats({ predictions }: PredictionStatsProps) {
  const calculateStats = () => {
    const total = predictions.length;
    if (total === 0) return { accuracy: 0, avgConfidence: 0, total: 0 };

    const correctPredictions = predictions.filter(p => p.isCorrect).length;
    const accuracy = (correctPredictions / total) * 100;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / total;

    return {
      accuracy,
      avgConfidence,
      total,
    };
  };

  const stats = calculateStats();

  return (
    <GlassmorphicCard style={styles.container}>
      <Text style={styles.title}>Your Performance</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.accuracy.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.avgConfidence.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Avg. Confidence</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Predictions</Text>
        </View>
      </View>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
});
