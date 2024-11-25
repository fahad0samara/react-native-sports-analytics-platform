import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Match } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface PredictionInsightsProps {
  match: Match;
}

interface InsightItem {
  type: 'positive' | 'negative' | 'neutral';
  text: string;
}

interface MatchInsights {
  homeTeam: InsightItem[];
  awayTeam: InsightItem[];
  general: InsightItem[];
  winProbability: {
    home: number;
    draw: number;
    away: number;
  };
}

// Mock data generator - Replace with actual AI analysis
const getMockInsights = (match: Match): MatchInsights => ({
  homeTeam: [
    {
      type: 'positive',
      text: 'Strong home record with 80% win rate in last 10 matches',
    },
    {
      type: 'positive',
      text: 'Key striker returning from injury',
    },
    {
      type: 'negative',
      text: 'Missing defensive midfielder due to suspension',
    },
  ],
  awayTeam: [
    {
      type: 'positive',
      text: 'Unbeaten in last 5 away matches',
    },
    {
      type: 'negative',
      text: 'Historically struggled at this venue',
    },
    {
      type: 'neutral',
      text: 'New tactical formation being tested',
    },
  ],
  general: [
    {
      type: 'neutral',
      text: 'Weather conditions favor attacking play',
    },
    {
      type: 'positive',
      text: 'High-scoring matches in recent head-to-head encounters',
    },
  ],
  winProbability: {
    home: 0.45,
    draw: 0.25,
    away: 0.30,
  },
});

const InsightIcon = ({ type }: { type: InsightItem['type'] }) => {
  const getIconProps = () => {
    switch (type) {
      case 'positive':
        return {
          name: 'trending-up',
          color: colors.status.success,
        };
      case 'negative':
        return {
          name: 'trending-down',
          color: colors.status.error,
        };
      default:
        return {
          name: 'remove',
          color: colors.text.secondary,
        };
    }
  };

  const { name, color } = getIconProps();
  return <Ionicons name={name as any} size={20} color={color} />;
};

const InsightList = ({ title, insights }: { title: string; insights: InsightItem[] }) => (
  <View style={styles.insightSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {insights.map((insight, index) => (
      <View key={index} style={styles.insightRow}>
        <InsightIcon type={insight.type} />
        <Text style={styles.insightText}>{insight.text}</Text>
      </View>
    ))}
  </View>
);

const WinProbability = ({ probabilities }: { probabilities: MatchInsights['winProbability'] }) => (
  <View style={styles.probabilitySection}>
    <Text style={styles.sectionTitle}>Win Probability</Text>
    <View style={styles.probabilityBar}>
      <View
        style={[
          styles.probabilitySegment,
          { flex: probabilities.home, backgroundColor: colors.status.success },
        ]}
      />
      <View
        style={[
          styles.probabilitySegment,
          { flex: probabilities.draw, backgroundColor: colors.status.warning },
        ]}
      />
      <View
        style={[
          styles.probabilitySegment,
          { flex: probabilities.away, backgroundColor: colors.status.error },
        ]}
      />
    </View>
    <View style={styles.probabilityLabels}>
      <Text style={styles.probabilityLabel}>
        Home {(probabilities.home * 100).toFixed(0)}%
      </Text>
      <Text style={styles.probabilityLabel}>
        Draw {(probabilities.draw * 100).toFixed(0)}%
      </Text>
      <Text style={styles.probabilityLabel}>
        Away {(probabilities.away * 100).toFixed(0)}%
      </Text>
    </View>
  </View>
);

export default function PredictionInsights({ match }: PredictionInsightsProps) {
  const insights = getMockInsights(match);

  return (
    <GlassmorphicCard style={styles.container}>
      <Text style={styles.title}>AI Match Analysis</Text>
      
      <WinProbability probabilities={insights.winProbability} />
      
      <InsightList title={`${match.homeTeam.name} Insights`} insights={insights.homeTeam} />
      <InsightList title={`${match.awayTeam.name} Insights`} insights={insights.awayTeam} />
      <InsightList title="General Match Insights" insights={insights.general} />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  insightSection: {
    marginTop: 16,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  probabilitySection: {
    marginBottom: 16,
  },
  probabilityBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  probabilitySegment: {
    height: '100%',
  },
  probabilityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  probabilityLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
