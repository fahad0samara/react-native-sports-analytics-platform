import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GlassmorphicCard } from '../common/GlassmorphicCard';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Filter {
  id: string;
  name: string;
  type: 'sport' | 'league' | 'timeframe';
}

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
}

const FILTERS: Filter[] = [
  { id: 'football', name: 'Football', type: 'sport' },
  { id: 'basketball', name: 'Basketball', type: 'sport' },
  { id: 'tennis', name: 'Tennis', type: 'sport' },
  { id: 'premier-league', name: 'Premier League', type: 'league' },
  { id: 'nba', name: 'NBA', type: 'league' },
  { id: 'today', name: 'Today', type: 'timeframe' },
  { id: 'week', name: 'This Week', type: 'timeframe' },
];

export const SearchFilters = ({ onSearch, onFilterChange }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterPress = (filterId: string) => {
    setSelectedFilters((prev) => {
      const newFilters = prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId];
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <GlassmorphicCard style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search predictions..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </GlassmorphicCard>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => handleFilterPress(filter.id)}
            style={[
              styles.filterButton,
              selectedFilters.includes(filter.id) && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilters.includes(filter.id) && styles.filterTextActive,
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
});
