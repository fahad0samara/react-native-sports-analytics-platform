import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'MatchDetails'>;

const StatisticItem = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.statisticItem}>
    <Text style={styles.statisticLabel}>{label}</Text>
    <Text style={styles.statisticValue}>{value}</Text>
  </View>
);

const TeamSection = ({ team, isHome }: { team: Match['homeTeam']; isHome: boolean }) => (
  <View style={[styles.teamSection, isHome ? styles.homeTeam : styles.awayTeam]}>
    <Text style={styles.teamName}>{team.name}</Text>
    {/* Add team logo here when available */}
    <View style={styles.teamStats}>
      <StatisticItem label="Form" value="WWDLW" />
      <StatisticItem label="Position" value="#4" />
      <StatisticItem label="Points" value="56" />
    </View>
  </View>
);

export default function MatchDetailsScreen({ route, navigation }: Props) {
  const { matchId } = route.params;
  const match = useSelector((state: RootState) => 
    state.matches.matches.find(m => m.id === matchId)
  );
  const isLoading = useSelector((state: RootState) => state.matches.isLoading);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match not found</Text>
      </View>
    );
  }

  const matchDate = new Date(match.startTime);

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
          <Text style={styles.headerTitle}>Match Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <GlassmorphicCard style={styles.matchInfoCard}>
            <Text style={styles.dateTime}>
              {matchDate.toLocaleDateString()} at{' '}
              {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            
            <View style={styles.teamsContainer}>
              <TeamSection team={match.homeTeam} isHome={true} />
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.matchStatus}>{match.status.toUpperCase()}</Text>
              </View>
              <TeamSection team={match.awayTeam} isHome={false} />
            </View>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.oddsCard}>
            <Text style={styles.sectionTitle}>Match Odds</Text>
            <View style={styles.oddsContainer}>
              <View style={styles.oddsItem}>
                <Text style={styles.oddsValue}>{match.odds.home}</Text>
                <Text style={styles.oddsLabel}>Home Win</Text>
              </View>
              <View style={styles.oddsItem}>
                <Text style={styles.oddsValue}>{match.odds.draw}</Text>
                <Text style={styles.oddsLabel}>Draw</Text>
              </View>
              <View style={styles.oddsItem}>
                <Text style={styles.oddsValue}>{match.odds.away}</Text>
                <Text style={styles.oddsLabel}>Away Win</Text>
              </View>
            </View>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.predictionCard}>
            <Text style={styles.sectionTitle}>AI Prediction</Text>
            <View style={styles.predictionContainer}>
              <View style={styles.predictionBar}>
                <View style={[styles.predictionFill, { width: '65%' }]} />
                <Text style={styles.predictionText}>65% Home Win</Text>
              </View>
              <View style={styles.predictionBar}>
                <View style={[styles.predictionFill, { width: '20%' }]} />
                <Text style={styles.predictionText}>20% Draw</Text>
              </View>
              <View style={styles.predictionBar}>
                <View style={[styles.predictionFill, { width: '15%' }]} />
                <Text style={styles.predictionText}>15% Away Win</Text>
              </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.text.error,
    fontSize: 16,
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  matchInfoCard: {
    padding: 16,
    marginBottom: 16,
  },
  dateTime: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  homeTeam: {
    alignItems: 'flex-start',
  },
  awayTeam: {
    alignItems: 'flex-end',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  teamStats: {
    width: '100%',
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  matchStatus: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  statisticItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statisticLabel: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  statisticValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  oddsCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  oddsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  oddsItem: {
    alignItems: 'center',
  },
  oddsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  oddsLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  predictionCard: {
    padding: 16,
    marginBottom: 16,
  },
  predictionContainer: {
    gap: 12,
  },
  predictionBar: {
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  predictionFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  predictionText: {
    position: 'absolute',
    left: 12,
    top: 8,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
