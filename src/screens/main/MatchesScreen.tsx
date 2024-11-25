import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Match } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedMatch } from '../../store/slices/matchesSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MatchesStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type MatchesScreenNavigationProp = NativeStackNavigationProp<MatchesStackParamList, 'MatchesList'>;

type FilterOption = 'all' | 'today' | 'tomorrow' | 'upcoming';
type SortOption = 'time' | 'league';

const dummyMatches: Match[] = [
  {
    id: '1',
    homeTeam: {
      id: 'team1',
      name: 'Manchester United',
      logo: 'https://example.com/mu.png',
    },
    awayTeam: {
      id: 'team2',
      name: 'Liverpool',
      logo: 'https://example.com/liv.png',
    },
    startTime: '2024-02-20T15:00:00Z',
    status: 'upcoming',
    odds: {
      home: 2.1,
      draw: 3.4,
      away: 2.8,
    },
  },
  {
    id: '2',
    homeTeam: {
      id: 'team3',
      name: 'Arsenal',
      logo: 'https://example.com/ars.png',
    },
    awayTeam: {
      id: 'team4',
      name: 'Chelsea',
      logo: 'https://example.com/che.png',
    },
    startTime: '2024-02-20T17:30:00Z',
    status: 'upcoming',
    odds: {
      home: 1.9,
      draw: 3.5,
      away: 3.2,
    },
  },
];

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

const MatchCard = ({ match, onPress }: { match: Match; onPress: () => void }) => {
  const matchDate = new Date(match.startTime);

  return (
    <TouchableOpacity onPress={onPress}>
      <GlassmorphicCard style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchTime}>
            {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.matchStatus}>{match.status.toUpperCase()}</Text>
        </View>
        
        <View style={styles.teamsContainer}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{match.homeTeam.name}</Text>
          </View>
          
          <Text style={styles.vs}>VS</Text>
          
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{match.awayTeam.name}</Text>
          </View>
        </View>

        <View style={styles.oddsContainer}>
          <View style={styles.oddsItem}>
            <Text style={styles.oddsLabel}>Home</Text>
            <Text style={styles.oddsValue}>{match.odds?.home}</Text>
          </View>
          <View style={styles.oddsItem}>
            <Text style={styles.oddsLabel}>Draw</Text>
            <Text style={styles.oddsValue}>{match.odds?.draw}</Text>
          </View>
          <View style={styles.oddsItem}>
            <Text style={styles.oddsLabel}>Away</Text>
            <Text style={styles.oddsValue}>{match.odds?.away}</Text>
          </View>
        </View>
      </GlassmorphicCard>
    </TouchableOpacity>
  );
};

export default function MatchesScreen() {
  const navigation = useNavigation<MatchesScreenNavigationProp>();
  const dispatch = useDispatch();
  const { matches, isLoading } = useSelector((state: RootState) => state.matches);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('time');

  const filterMatches = useCallback((matches: Match[], filter: FilterOption) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case 'today':
        return matches.filter(match => {
          const matchDate = new Date(match.startTime);
          return matchDate >= today && matchDate < tomorrow;
        });
      case 'tomorrow':
        return matches.filter(match => {
          const matchDate = new Date(match.startTime);
          const nextDay = new Date(tomorrow);
          nextDay.setDate(nextDay.getDate() + 1);
          return matchDate >= tomorrow && matchDate < nextDay;
        });
      case 'upcoming':
        return matches.filter(match => new Date(match.startTime) > today);
      default:
        return matches;
    }
  }, []);

  const sortMatches = useCallback((matches: Match[], sort: SortOption) => {
    switch (sort) {
      case 'time':
        return [...matches].sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      case 'league':
        // TODO: Implement league-based sorting when league info is available
        return matches;
      default:
        return matches;
    }
  }, []);

  const filteredAndSortedMatches = sortMatches(
    filterMatches(matches || dummyMatches, activeFilter),
    activeSort
  );

  const handleMatchPress = (match: Match) => {
    dispatch(setSelectedMatch(match));
    navigation.navigate('MatchDetails', { matchId: match.id });
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
          <Text style={styles.headerTitle}>Matches</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Ionicons name="options-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

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
              title="Today"
              active={activeFilter === 'today'}
              onPress={() => setActiveFilter('today')}
            />
            <FilterButton
              title="Tomorrow"
              active={activeFilter === 'tomorrow'}
              onPress={() => setActiveFilter('tomorrow')}
            />
            <FilterButton
              title="Upcoming"
              active={activeFilter === 'upcoming'}
              onPress={() => setActiveFilter('upcoming')}
            />
          </ScrollView>
        </View>

        <FlatList
          data={filteredAndSortedMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => handleMatchPress(item)}
            />
          )}
          contentContainerStyle={styles.matchesList}
          showsVerticalScrollIndicator={false}
        />
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
  sortButton: {
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
  matchesList: {
    padding: 16,
    gap: 16,
  },
  matchCard: {
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchTime: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  matchStatus: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  vs: {
    marginHorizontal: 12,
    color: colors.text.secondary,
    fontSize: 14,
  },
  oddsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  oddsItem: {
    alignItems: 'center',
  },
  oddsLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  oddsValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});
