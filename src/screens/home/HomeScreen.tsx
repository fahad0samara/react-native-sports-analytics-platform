import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { Ionicons } from '@expo/vector-icons';

const MOCK_DATA = {
  todayStats: {
    steps: 8432,
    calories: 534,
    distance: 5.2,
    duration: 45,
  },
  weeklyProgress: [65, 78, 82, 75, 90, 85, 88],
  upcomingEvents: [
    { id: 1, title: 'Soccer Practice', time: '2:00 PM', type: 'football' },
    { id: 2, title: 'Basketball Game', time: '5:30 PM', type: 'basketball' },
    { id: 3, title: 'Running Session', time: '7:00 AM', type: 'running' },
  ],
  achievements: [
    { id: 1, title: '5K Master', description: 'Completed 10 5K runs', icon: 'trophy' },
    { id: 2, title: 'Team Player', description: 'Joined 5 team events', icon: 'people' },
    { id: 3, title: 'Early Bird', description: 'Completed 5 morning workouts', icon: 'sunny' },
  ],
};

export default function HomeScreen() {
  const [selectedMetric, setSelectedMetric] = useState('week');

  const renderMetricCard = (title: string, value: number, unit: string, icon: string) => (
    <GlassmorphicCard style={styles.metricCard}>
      <Ionicons name={icon as any} size={24} color={colors.text.light} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </GlassmorphicCard>
  );

  const renderProgressChart = () => (
    <View style={styles.chartContainer}>
      {MOCK_DATA.weeklyProgress.map((value, index) => (
        <View key={index} style={styles.chartBar}>
          <View style={[styles.chartFill, { height: `${value}%` }]} />
          <Text style={styles.chartLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sports Analytics</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.text.light} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.metricsContainer}>
            {renderMetricCard('Steps', MOCK_DATA.todayStats.steps, 'steps', 'footsteps')}
            {renderMetricCard('Calories', MOCK_DATA.todayStats.calories, 'kcal', 'flame')}
            {renderMetricCard('Distance', MOCK_DATA.todayStats.distance, 'km', 'map')}
            {renderMetricCard('Duration', MOCK_DATA.todayStats.duration, 'min', 'time')}
          </View>

          <GlassmorphicCard style={styles.progressCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Progress</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    selectedMetric === 'week' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setSelectedMetric('week')}
                >
                  <Text style={[
                    styles.segmentButtonText,
                    selectedMetric === 'week' && styles.segmentButtonTextActive,
                  ]}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    selectedMetric === 'month' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setSelectedMetric('month')}
                >
                  <Text style={[
                    styles.segmentButtonText,
                    selectedMetric === 'month' && styles.segmentButtonTextActive,
                  ]}>Month</Text>
                </TouchableOpacity>
              </View>
            </View>
            {renderProgressChart()}
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.eventsCard}>
            <Text style={styles.cardTitle}>Upcoming Events</Text>
            {MOCK_DATA.upcomingEvents.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventItem}>
                <View style={styles.eventIcon}>
                  <Ionicons name={event.type as any} size={24} color={colors.text.light} />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
              </TouchableOpacity>
            ))}
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.achievementsCard}>
            <Text style={styles.cardTitle}>Recent Achievements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {MOCK_DATA.achievements.map((achievement) => (
                <TouchableOpacity key={achievement.id} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <Ionicons name={achievement.icon as any} size={32} color={colors.text.light} />
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </GlassmorphicCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: (width - 48) / 2,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.light,
    marginTop: 8,
  },
  metricUnit: {
    fontSize: 14,
    color: colors.text.light,
    opacity: 0.8,
  },
  metricTitle: {
    fontSize: 16,
    color: colors.text.light,
    marginTop: 4,
  },
  progressCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: colors.primary,
  },
  segmentButtonText: {
    color: colors.text.light,
    opacity: 0.8,
  },
  segmentButtonTextActive: {
    opacity: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 16,
  },
  chartBar: {
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartFill: {
    width: '60%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  chartLabel: {
    marginTop: 8,
    color: colors.text.light,
    fontSize: 12,
  },
  eventsCard: {
    padding: 16,
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    color: colors.text.light,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: colors.text.light,
    opacity: 0.8,
  },
  achievementsCard: {
    padding: 16,
  },
  achievementItem: {
    width: 160,
    padding: 16,
    marginRight: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.text.light,
    opacity: 0.8,
    textAlign: 'center',
  },
});
