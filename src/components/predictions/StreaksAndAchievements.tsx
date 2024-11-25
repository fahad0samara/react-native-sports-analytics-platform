import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Streak {
  type: 'current' | 'best';
  count: number;
  startDate: string;
  endDate?: string;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

interface StreaksAndAchievementsProps {
  currentStreak: Streak;
  bestStreak: Streak;
  achievements: Achievement[];
}

const StreakCard = ({ streak, type }: { streak: Streak; type: 'current' | 'best' }) => (
  <View style={styles.streakCard}>
    <View style={styles.streakHeader}>
      <Ionicons
        name={type === 'current' ? 'flame' : 'trophy'}
        size={24}
        color={type === 'current' ? colors.status.warning : colors.status.success}
      />
      <Text style={styles.streakTitle}>
        {type === 'current' ? 'Current Streak' : 'Best Streak'}
      </Text>
    </View>
    <Text style={styles.streakCount}>{streak.count}</Text>
    <Text style={styles.streakDates}>
      {new Date(streak.startDate).toLocaleDateString()} -{' '}
      {streak.endDate ? new Date(streak.endDate).toLocaleDateString() : 'Present'}
    </Text>
  </View>
);

const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
  <View style={styles.achievementCard}>
    <View style={styles.achievementIcon}>
      <Ionicons
        name={achievement.icon as any}
        size={24}
        color={achievement.completed ? colors.status.success : colors.text.secondary}
      />
    </View>
    <View style={styles.achievementInfo}>
      <Text style={styles.achievementTitle}>{achievement.title}</Text>
      <Text style={styles.achievementDescription}>
        {achievement.description}
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(achievement.progress / achievement.target) * 100}%`,
                backgroundColor: achievement.completed
                  ? colors.status.success
                  : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {achievement.progress}/{achievement.target}
        </Text>
      </View>
    </View>
  </View>
);

export default function StreaksAndAchievements({
  currentStreak,
  bestStreak,
  achievements,
}: StreaksAndAchievementsProps) {
  return (
    <GlassmorphicCard style={styles.container}>
      <Text style={styles.title}>Streaks & Achievements</Text>

      <View style={styles.streaksContainer}>
        <StreakCard streak={currentStreak} type="current" />
        <StreakCard streak={bestStreak} type="best" />
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.subtitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
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
  streaksContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  streakCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  streakCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  streakDates: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 16,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    minWidth: 45,
  },
});
