import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Match } from '../../types';

interface HeadToHeadAnalysisProps {
  match: Match;
}

interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  form: ('W' | 'D' | 'L')[];
}

interface HeadToHeadStats {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  lastMeetings: {
    date: string;
    homeScore: number;
    awayScore: number;
    winner: 'home' | 'away' | 'draw';
  }[];
}

// Mock data generator - Replace with actual API call
const getMockHeadToHeadStats = (match: Match): HeadToHeadStats => ({
  homeTeam: {
    wins: 3,
    draws: 1,
    losses: 1,
    goalsScored: 12,
    goalsConceded: 7,
    form: ['W', 'W', 'L', 'W', 'D'],
  },
  awayTeam: {
    wins: 2,
    draws: 2,
    losses: 1,
    goalsScored: 8,
    goalsConceded: 6,
    form: ['D', 'W', 'D', 'L', 'W'],
  },
  lastMeetings: [
    {
      date: '2024-01-15',
      homeScore: 2,
      awayScore: 1,
      winner: 'home',
    },
    {
      date: '2023-09-20',
      homeScore: 1,
      awayScore: 1,
      winner: 'draw',
    },
    {
      date: '2023-05-10',
      homeScore: 0,
      awayScore: 2,
      winner: 'away',
    },
  ],
});

const FormIndicator = ({ result }: { result: 'W' | 'D' | 'L' }) => {
  const getColor = () => {
    switch (result) {
      case 'W':
        return colors.status.success;
      case 'D':
        return colors.status.warning;
      case 'L':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <View style={[styles.formIndicator, { backgroundColor: getColor() }]}>
      <Text style={styles.formText}>{result}</Text>
    </View>
  );
};

const StatRow = ({ label, home, away }: { label: string; home: string | number; away: string | number }) => (
  <View style={styles.statRow}>
    <Text style={styles.statValue}>{home}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{away}</Text>
  </View>
);

export default function HeadToHeadAnalysis({ match }: HeadToHeadAnalysisProps) {
  const stats = getMockHeadToHeadStats(match);

  return (
    <GlassmorphicCard style={styles.container}>
      <Text style={styles.title}>Head-to-Head Analysis</Text>

      <View style={styles.formSection}>
        <View style={styles.teamForm}>
          {stats.homeTeam.form.map((result, index) => (
            <FormIndicator key={`home-${index}`} result={result} />
          ))}
        </View>
        <Text style={styles.formLabel}>Form</Text>
        <View style={styles.teamForm}>
          {stats.awayTeam.form.map((result, index) => (
            <FormIndicator key={`away-${index}`} result={result} />
          ))}
        </View>
      </View>

      <View style={styles.statsSection}>
        <StatRow
          label="Wins"
          home={stats.homeTeam.wins}
          away={stats.awayTeam.wins}
        />
        <StatRow
          label="Draws"
          home={stats.homeTeam.draws}
          away={stats.awayTeam.draws}
        />
        <StatRow
          label="Losses"
          home={stats.homeTeam.losses}
          away={stats.awayTeam.losses}
        />
        <StatRow
          label="Goals Scored"
          home={stats.homeTeam.goalsScored}
          away={stats.awayTeam.goalsScored}
        />
        <StatRow
          label="Goals Conceded"
          home={stats.homeTeam.goalsConceded}
          away={stats.awayTeam.goalsConceded}
        />
      </View>

      <View style={styles.lastMeetings}>
        <Text style={styles.subtitle}>Last Meetings</Text>
        {stats.lastMeetings.map((meeting, index) => (
          <View key={index} style={styles.meetingRow}>
            <Text style={styles.meetingDate}>
              {new Date(meeting.date).toLocaleDateString()}
            </Text>
            <View style={styles.scoreContainer}>
              <Text
                style={[
                  styles.score,
                  meeting.winner === 'home' && styles.winnerScore,
                ]}
              >
                {meeting.homeScore}
              </Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text
                style={[
                  styles.score,
                  meeting.winner === 'away' && styles.winnerScore,
                ]}
              >
                {meeting.awayScore}
              </Text>
            </View>
          </View>
        ))}
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
  formSection: {
    marginBottom: 24,
  },
  teamForm: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  formLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: 4,
  },
  formIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  statsSection: {
    marginBottom: 24,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  lastMeetings: {
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  meetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  meetingDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  score: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  winnerScore: {
    color: colors.status.success,
    fontWeight: 'bold',
  },
});
