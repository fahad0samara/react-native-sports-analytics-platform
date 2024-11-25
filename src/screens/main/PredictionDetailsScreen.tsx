import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PredictionsStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PredictionDetailsScreenRouteProp = RouteProp<
  PredictionsStackParamList,
  'PredictionDetails'
>;

type PredictionDetailsScreenNavigationProp = NativeStackNavigationProp<
  PredictionsStackParamList,
  'PredictionDetails'
>;

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default function PredictionDetailsScreen() {
  const route = useRoute<PredictionDetailsScreenRouteProp>();
  const navigation = useNavigation<PredictionDetailsScreenNavigationProp>();
  const { predictionId } = route.params;

  const prediction = useSelector((state: RootState) =>
    state.predictions.userPredictions.find(
      p => `${p.match.id}-${p.timestamp}` === predictionId
    )
  );

  if (!prediction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Prediction not found</Text>
      </View>
    );
  }

  const predictionDate = new Date(prediction.timestamp);
  const matchDate = new Date(prediction.match.startTime);

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
          <Text style={styles.headerTitle}>Prediction Details</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GlassmorphicCard style={styles.matchCard}>
            <Text style={styles.sectionTitle}>Match Information</Text>
            <View style={styles.teamsContainer}>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>
                  {prediction.match.homeTeam.name}
                </Text>
                <Text style={styles.homeLabel}>Home</Text>
              </View>
              <View style={styles.vsContainer}>
                <Text style={styles.vs}>VS</Text>
                <Text style={styles.matchTime}>
                  {matchDate.toLocaleDateString()}
                </Text>
                <Text style={styles.matchTime}>
                  {matchDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>
                  {prediction.match.awayTeam.name}
                </Text>
                <Text style={styles.awayLabel}>Away</Text>
              </View>
            </View>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.predictionCard}>
            <Text style={styles.sectionTitle}>Your Prediction</Text>
            <View style={styles.predictionStats}>
              <StatItem
                label="Made On"
                value={predictionDate.toLocaleString()}
              />
              <StatItem
                label="Predicted Winner"
                value={
                  prediction.winner === 'home'
                    ? prediction.match.homeTeam.name
                    : prediction.match.awayTeam.name
                }
              />
              <StatItem
                label="Confidence"
                value={`${prediction.confidence}%`}
              />
              {prediction.isCorrect !== undefined && (
                <StatItem
                  label="Result"
                  value={prediction.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                />
              )}
            </View>
          </GlassmorphicCard>

          {prediction.analysis && (
            <GlassmorphicCard style={styles.analysisCard}>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              <Text style={styles.analysisText}>{prediction.analysis}</Text>
            </GlassmorphicCard>
          )}
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
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  matchCard: {
    padding: 16,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  homeLabel: {
    fontSize: 12,
    color: colors.status.success,
  },
  awayLabel: {
    fontSize: 12,
    color: colors.status.warning,
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  vs: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  matchTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  predictionCard: {
    padding: 16,
  },
  predictionStats: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  analysisCard: {
    padding: 16,
  },
  analysisText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
});
