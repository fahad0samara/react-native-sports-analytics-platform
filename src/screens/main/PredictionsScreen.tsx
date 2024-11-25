import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Match, Prediction } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import PredictionStats from '../../components/predictions/PredictionStats';
import PredictionTrends from '../../components/predictions/PredictionTrends';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PredictionsStackParamList } from '../../navigation/types';

type PredictionsScreenNavigationProp = NativeStackNavigationProp<PredictionsStackParamList, 'PredictionsList'>;

interface PredictionWithMatch extends Prediction {
  match: Match;
}

type FilterOption = 'all' | 'correct' | 'incorrect' | 'pending';

const FilterButton = ({ 
  title, 
  active, 
  onPress 
}: { 
  title: string; 
  active: boolean; 
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const PredictionCard = ({ prediction, onPress }: { prediction: PredictionWithMatch; onPress: () => void }) => {
  const predictionDate = new Date(prediction.timestamp);
  const matchDate = new Date(prediction.match.startTime);

  const getWinnerTeam = () => {
    return prediction.winner === 'home' 
      ? prediction.match.homeTeam.name 
      : prediction.winner === 'away'
      ? prediction.match.awayTeam.name
      : 'Draw';
  };

  const getStatusColor = () => {
    if (prediction.isCorrect === undefined) return colors.text.secondary;
    return prediction.isCorrect ? colors.status.success : colors.status.error;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <GlassmorphicCard style={styles.predictionCard}>
        <View style={styles.predictionHeader}>
          <Text style={styles.predictionTime}>
            Predicted: {predictionDate.toLocaleDateString()}
          </Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <Text style={styles.confidenceValue}>{prediction.confidence}%</Text>
          </View>
        </View>

        <View style={styles.matchInfo}>
          <Text style={styles.matchTime}>
            {matchDate.toLocaleDateString()} at {' '}
            {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={styles.teamsContainer}>
            <Text style={styles.teamName}>{prediction.match.homeTeam.name}</Text>
            <Text style={styles.vs}>VS</Text>
            <Text style={styles.teamName}>{prediction.match.awayTeam.name}</Text>
          </View>
        </View>

        <View style={styles.predictionResult}>
          <View style={styles.predictionInfo}>
            <Text style={styles.predictionLabel}>Your Prediction:</Text>
            <Text style={styles.predictionValue}>{getWinnerTeam()} to Win</Text>
          </View>
          {prediction.isCorrect !== undefined && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>
                {prediction.isCorrect ? 'Correct' : 'Incorrect'}
              </Text>
            </View>
          )}
        </View>
      </GlassmorphicCard>
    </TouchableOpacity>
  );
};

export default function PredictionsScreen() {
  const navigation = useNavigation<PredictionsScreenNavigationProp>();
  const { userPredictions, isLoading } = useSelector((state: RootState) => state.predictions);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filterPredictions = useCallback((predictions: PredictionWithMatch[], filter: FilterOption) => {
    switch (filter) {
      case 'correct':
        return predictions.filter(p => p.isCorrect === true);
      case 'incorrect':
        return predictions.filter(p => p.isCorrect === false);
      case 'pending':
        return predictions.filter(p => p.isCorrect === undefined);
      default:
        return predictions;
    }
  }, []);

  const filteredPredictions = filterPredictions(userPredictions as PredictionWithMatch[], activeFilter);

  const handlePredictionPress = (prediction: PredictionWithMatch) => {
    navigation.navigate('PredictionDetails', { predictionId: `${prediction.match.id}-${prediction.timestamp}` });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Predictions</Text>
          <TouchableOpacity 
            style={styles.statsButton}
            onPress={() => navigation.navigate('PredictionStats')}
          >
            <Ionicons name="stats-chart" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <PredictionStats predictions={userPredictions as PredictionWithMatch[]} />
        <PredictionTrends predictions={userPredictions as PredictionWithMatch[]} />

        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <FilterButton
              title="All"
              active={activeFilter === 'all'}
              onPress={() => setActiveFilter('all')}
            />
            <FilterButton
              title="Correct"
              active={activeFilter === 'correct'}
              onPress={() => setActiveFilter('correct')}
            />
            <FilterButton
              title="Incorrect"
              active={activeFilter === 'incorrect'}
              onPress={() => setActiveFilter('incorrect')}
            />
            <FilterButton
              title="Pending"
              active={activeFilter === 'pending'}
              onPress={() => setActiveFilter('pending')}
            />
          </ScrollView>
        </View>

        <FlatList
          data={filteredPredictions}
          keyExtractor={(item) => `${item.match.id}-${item.timestamp}`}
          renderItem={({ item }) => (
            <PredictionCard
              prediction={item}
              onPress={() => handlePredictionPress(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No predictions found</Text>
              <Text style={styles.emptySubtext}>
                Start making predictions to see them here
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreatePrediction')}
        >
          <Ionicons name="add" size={24} color={colors.text.light} />
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statsButton: {
    padding: 8,
  },
  filterContainer: {
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.text.light,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  predictionCard: {
    padding: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  matchInfo: {
    marginBottom: 12,
  },
  matchTime: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  vs: {
    marginHorizontal: 12,
    color: colors.text.secondary,
    fontSize: 14,
  },
  predictionResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  predictionInfo: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.light,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
