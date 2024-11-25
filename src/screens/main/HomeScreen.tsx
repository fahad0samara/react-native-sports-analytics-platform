import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>Sports Analytics</Text>
          
          <GlassmorphicCard style={styles.statsCard}>
            <Text style={styles.cardTitle}>Your Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>124</Text>
                <Text style={styles.statLabel}>Predictions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.upcomingCard}>
            <Text style={styles.cardTitle}>Upcoming Matches</Text>
            <Text style={styles.placeholderText}>No upcoming matches</Text>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.trendingCard}>
            <Text style={styles.cardTitle}>Trending Predictions</Text>
            <Text style={styles.placeholderText}>No trending predictions</Text>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 20,
  },
  statsCard: {
    marginBottom: 20,
  },
  upcomingCard: {
    marginBottom: 20,
  },
  trendingCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 5,
  },
  placeholderText: {
    color: colors.text.secondary,
    textAlign: 'center',
    padding: 20,
  },
});
