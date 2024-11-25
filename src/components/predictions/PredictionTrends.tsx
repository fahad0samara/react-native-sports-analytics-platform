import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Prediction } from '../../types';
import { LineChart } from 'react-native-chart-kit';

interface PredictionTrendsProps {
  predictions: Prediction[];
  days?: number;
}

export default function PredictionTrends({ predictions, days = 7 }: PredictionTrendsProps) {
  const getChartData = () => {
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - days));
    const dailyStats = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date,
        accuracy: 0,
        total: 0,
      };
    });

    // Filter predictions within the date range and sort by date
    const recentPredictions = predictions
      .filter(p => p.isCorrect !== undefined && new Date(p.timestamp) >= startDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Calculate daily accuracy
    recentPredictions.forEach(prediction => {
      const predDate = new Date(prediction.timestamp);
      const dayIndex = Math.floor((predDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < days) {
        dailyStats[dayIndex].total++;
        if (prediction.isCorrect) {
          dailyStats[dayIndex].accuracy++;
        }
      }
    });

    // Calculate accuracy percentages
    const accuracyData = dailyStats.map(day => 
      day.total > 0 ? (day.accuracy / day.total) * 100 : 0
    );

    const labels = dailyStats.map(day => 
      day.date.toLocaleDateString(undefined, { weekday: 'short' })
    );

    return {
      labels,
      datasets: [{
        data: accuracyData,
      }],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const chartData = getChartData();

  return (
    <GlassmorphicCard style={styles.container}>
      <Text style={styles.title}>Prediction Accuracy Trend</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withDots={true}
          segments={4}
        />
      </View>
      <Text style={styles.subtitle}>Last {days} Days</Text>
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
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
