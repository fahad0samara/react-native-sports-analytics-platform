import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  type: 'user' | 'prediction';
  data: {
    username?: string;
    avatar?: string;
    verified?: boolean;
    bio?: string;
    match?: {
      homeTeam: {
        name: string;
        logo: string;
      };
      awayTeam: {
        name: string;
        logo: string;
      };
      date: string;
      league: string;
    };
    prediction?: {
      winner: 'home' | 'away' | 'draw';
      confidence: number;
      analysis: string;
    };
  };
}

// Mock data - Replace with actual API calls
const mockSearchResults: SearchResult[] = [
  {
    id: 'user1',
    type: 'user',
    data: {
      username: 'JohnDoe',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true,
      bio: 'Sports enthusiast | Premier League expert',
    },
  },
  {
    id: 'pred1',
    type: 'prediction',
    data: {
      username: 'JaneSmith',
      avatar: 'https://example.com/avatar2.jpg',
      match: {
        homeTeam: {
          name: 'Manchester United',
          logo: 'https://example.com/man-utd.png',
        },
        awayTeam: {
          name: 'Liverpool',
          logo: 'https://example.com/liverpool.png',
        },
        date: '2024-02-20T15:00:00Z',
        league: 'Premier League',
      },
      prediction: {
        winner: 'home',
        confidence: 85,
        analysis: 'Manchester United's recent form gives them the edge.',
      },
    },
  },
];

const SearchResultItem = ({ item, onPress }: { item: SearchResult; onPress: () => void }) => {
  if (item.type === 'user') {
    return (
      <GlassmorphicCard style={styles.resultCard}>
        <TouchableOpacity style={styles.userResult} onPress={onPress}>
          <Image source={{ uri: item.data.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{item.data.username}</Text>
              {item.data.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.status.success}
                  style={styles.verifiedBadge}
                />
              )}
            </View>
            <Text style={styles.bio} numberOfLines={1}>
              {item.data.bio}
            </Text>
          </View>
        </TouchableOpacity>
      </GlassmorphicCard>
    );
  }

  return (
    <GlassmorphicCard style={styles.resultCard}>
      <TouchableOpacity style={styles.predictionResult} onPress={onPress}>
        <View style={styles.predictionHeader}>
          <Image source={{ uri: item.data.avatar }} style={styles.smallAvatar} />
          <Text style={styles.username}>{item.data.username}</Text>
        </View>
        <View style={styles.matchInfo}>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: item.data.match?.homeTeam.logo }}
              style={styles.teamLogo}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {item.data.match?.homeTeam.name}
            </Text>
          </View>
          <View style={styles.matchDetails}>
            <Text style={styles.leagueName}>{item.data.match?.league}</Text>
            <Text style={styles.vsText}>vs</Text>
            <Text style={styles.matchDate}>
              {new Date(item.data.match?.date || '').toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: item.data.match?.awayTeam.logo }}
              style={styles.teamLogo}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {item.data.match?.awayTeam.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </GlassmorphicCard>
  );
};

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Implement actual search functionality
  const performSearch = useCallback(
    debounce((query: string) => {
      setIsSearching(true);
      // Replace with actual API call
      setTimeout(() => {
        setResults(
          mockSearchResults.filter(
            (result) =>
              result.data.username?.toLowerCase().includes(query.toLowerCase()) ||
              result.data.match?.homeTeam.name
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              result.data.match?.awayTeam.name
                .toLowerCase()
                .includes(query.toLowerCase())
          )
        );
        setIsSearching(false);
      }, 500);
    }, 300),
    []
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      performSearch(text);
    } else {
      setResults([]);
    }
  };

  const handleResultPress = (item: SearchResult) => {
    if (item.type === 'user') {
      navigation.navigate('UserProfile', { userId: item.id });
    } else {
      navigation.navigate('PredictionDetails', { predictionId: item.id });
    }
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
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users and predictions..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleSearch('')}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isSearching ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Searching...</Text>
          </View>
        ) : results.length === 0 && searchQuery.trim() ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No results found</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SearchResultItem
                item={item}
                onPress={() => handleResultPress(item)}
              />
            )}
            contentContainerStyle={styles.resultsList}
          />
        )}
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
    padding: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.text.primary,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  resultsList: {
    padding: 16,
    gap: 12,
  },
  resultCard: {
    padding: 12,
  },
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  predictionResult: {
    gap: 12,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  teamName: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
  },
  matchDetails: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  leagueName: {
    fontSize: 10,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  vsText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  matchDate: {
    fontSize: 10,
    color: colors.text.secondary,
  },
});
