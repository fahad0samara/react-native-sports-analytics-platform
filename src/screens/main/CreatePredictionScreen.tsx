import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PredictionsStackParamList } from '../../navigation/types';
import { Match } from '../../types';
import Slider from '@react-native-community/slider';
import { addPrediction } from '../../store/slices/predictionsSlice';
import HeadToHeadAnalysis from '../../components/predictions/HeadToHeadAnalysis';
import PredictionInsights from '../../components/predictions/PredictionInsights';

type CreatePredictionScreenRouteProp = RouteProp<
  PredictionsStackParamList,
  'CreatePrediction'
>;

type CreatePredictionScreenNavigationProp = NativeStackNavigationProp<
  PredictionsStackParamList,
  'CreatePrediction'
>;

type Winner = 'home' | 'away' | 'draw';

const TeamSelector = ({
  team,
  isSelected,
  onSelect,
}: {
  team: Match['homeTeam'] | Match['awayTeam'];
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[styles.teamButton, isSelected && styles.teamButtonSelected]}
    onPress={onSelect}
  >
    <Text style={[styles.teamName, isSelected && styles.teamNameSelected]}>
      {team.name}
    </Text>
  </TouchableOpacity>
);

export default function CreatePredictionScreen() {
  const route = useRoute<CreatePredictionScreenRouteProp>();
  const navigation = useNavigation<CreatePredictionScreenNavigationProp>();
  const dispatch = useDispatch();
  const { match } = route.params;

  const [winner, setWinner] = useState<Winner | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!winner) return;

    setIsLoading(true);
    try {
      // In a real app, you would make an API call here to get AI analysis
      const mockAiAnalysis = "Based on recent performance metrics and historical data, this prediction aligns with current team trends. Key factors include team form, head-to-head records, and player availability.";
      setAiAnalysis(mockAiAnalysis);

      const prediction = {
        matchId: match.id,
        winner,
        confidence,
        timestamp: new Date().toISOString(),
        userId: 'user1', // Replace with actual user ID
        match,
        analysis: mockAiAnalysis,
      };

      dispatch(addPrediction(prediction));
      navigation.goBack();
    } catch (error) {
      console.error('Error creating prediction:', error);
    } finally {
      setIsLoading(false);
    }
  }, [winner, confidence, match, dispatch, navigation]);

  const getConfidenceColor = () => {
    if (confidence < 33) return colors.status.error;
    if (confidence < 66) return colors.status.warning;
    return colors.status.success;
  };

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
          <Text style={styles.headerTitle}>Make Prediction</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GlassmorphicCard style={styles.matchCard}>
            <Text style={styles.sectionTitle}>Match</Text>
            <View style={styles.matchInfo}>
              <Text style={styles.matchTime}>
                {new Date(match.startTime).toLocaleDateString()} at{' '}
                {new Date(match.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.predictionCard}>
            <Text style={styles.sectionTitle}>Your Prediction</Text>
            <View style={styles.teamButtons}>
              <TeamSelector
                team={match.homeTeam}
                isSelected={winner === 'home'}
                onSelect={() => setWinner('home')}
              />
              <TouchableOpacity
                style={[styles.drawButton, winner === 'draw' && styles.teamButtonSelected]}
                onPress={() => setWinner('draw')}
              >
                <Text style={[styles.drawText, winner === 'draw' && styles.teamNameSelected]}>
                  Draw
                </Text>
              </TouchableOpacity>
              <TeamSelector
                team={match.awayTeam}
                isSelected={winner === 'away'}
                onSelect={() => setWinner('away')}
              />
            </View>

            <View style={styles.confidenceContainer}>
              <View style={styles.confidenceHeader}>
                <Text style={styles.confidenceTitle}>Confidence</Text>
                <Text
                  style={[styles.confidenceValue, { color: getConfidenceColor() }]}
                >
                  {confidence}%
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={confidence}
                onValueChange={setConfidence}
                minimumTrackTintColor={getConfidenceColor()}
                maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                thumbTintColor={getConfidenceColor()}
              />
            </View>
          </GlassmorphicCard>

          <HeadToHeadAnalysis match={match} />
          <View style={styles.spacing} />
          <PredictionInsights match={match} />

          {aiAnalysis && (
            <GlassmorphicCard style={styles.analysisCard}>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              <Text style={styles.analysisText}>{aiAnalysis}</Text>
            </GlassmorphicCard>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!winner || isLoading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!winner || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.light} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Prediction</Text>
            )}
          </TouchableOpacity>
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
  matchInfo: {
    alignItems: 'center',
  },
  matchTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  predictionCard: {
    padding: 16,
  },
  teamButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  teamButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  teamButtonSelected: {
    backgroundColor: colors.primary,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  teamNameSelected: {
    color: colors.text.light,
  },
  drawButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
    alignItems: 'center',
  },
  drawText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  confidenceContainer: {
    marginTop: 8,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  analysisCard: {
    padding: 16,
  },
  analysisText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  spacing: {
    height: 16,
  },
});
