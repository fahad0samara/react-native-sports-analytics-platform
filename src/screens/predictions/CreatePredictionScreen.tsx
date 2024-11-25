import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { predictionService } from '../../services/predictionService';

interface Match {
  id: string;
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
}

export const CreatePredictionScreen = () => {
  const navigation = useNavigation();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<'home' | 'away' | 'draw'>('home');
  const [confidence, setConfidence] = useState('75');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Match[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      // TODO: Replace with actual API call
      const mockResults: Match[] = [
        {
          id: '1',
          homeTeam: {
            name: 'Manchester United',
            logo: 'https://example.com/man-utd.png',
          },
          awayTeam: {
            name: 'Liverpool',
            logo: 'https://example.com/liverpool.png',
          },
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          league: 'Premier League',
        },
        // Add more mock matches...
      ];
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching matches:', error);
      Alert.alert('Error', 'Failed to search matches');
    }
  };

  const handleSubmit = async () => {
    if (!selectedMatch) {
      Alert.alert('Error', 'Please select a match');
      return;
    }

    if (!analysis) {
      Alert.alert('Error', 'Please provide your analysis');
      return;
    }

    try {
      setLoading(true);
      await predictionService.createPrediction({
        matchId: selectedMatch.id,
        prediction,
        confidence: parseInt(confidence),
        analysis,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating prediction:', error);
      Alert.alert('Error', 'Failed to create prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundDark]}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Prediction</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <GlassmorphicCard style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Select Match</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for matches..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchResults.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={[
                  styles.matchItem,
                  selectedMatch?.id === match.id && styles.selectedMatch,
                ]}
                onPress={() => setSelectedMatch(match)}
              >
                <Text style={styles.matchTeams}>
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </Text>
                <Text style={styles.matchInfo}>
                  {match.league} • {new Date(match.date).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </GlassmorphicCard>

          {selectedMatch && (
            <>
              <GlassmorphicCard style={styles.predictionSection}>
                <Text style={styles.sectionTitle}>Your Prediction</Text>
                <View style={styles.predictionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.predictionButton,
                      prediction === 'home' && styles.selectedPrediction,
                    ]}
                    onPress={() => setPrediction('home')}
                  >
                    <Text
                      style={[
                        styles.predictionButtonText,
                        prediction === 'home' && styles.selectedPredictionText,
                      ]}
                    >
                      {selectedMatch.homeTeam.name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.predictionButton,
                      prediction === 'draw' && styles.selectedPrediction,
                    ]}
                    onPress={() => setPrediction('draw')}
                  >
                    <Text
                      style={[
                        styles.predictionButtonText,
                        prediction === 'draw' && styles.selectedPredictionText,
                      ]}
                    >
                      Draw
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.predictionButton,
                      prediction === 'away' && styles.selectedPrediction,
                    ]}
                    onPress={() => setPrediction('away')}
                  >
                    <Text
                      style={[
                        styles.predictionButtonText,
                        prediction === 'away' && styles.selectedPredictionText,
                      ]}
                    >
                      {selectedMatch.awayTeam.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              </GlassmorphicCard>

              <GlassmorphicCard style={styles.confidenceSection}>
                <Text style={styles.sectionTitle}>Confidence Level</Text>
                <View style={styles.confidenceSlider}>
                  <TextInput
                    style={styles.confidenceInput}
                    keyboardType="numeric"
                    value={confidence}
                    onChangeText={(value) => {
                      const num = parseInt(value);
                      if (!isNaN(num) && num >= 0 && num <= 100) {
                        setConfidence(value);
                      }
                    }}
                    maxLength={3}
                  />
                  <Text style={styles.confidencePercent}>%</Text>
                </View>
              </GlassmorphicCard>

              <GlassmorphicCard style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>Analysis</Text>
                <TextInput
                  style={styles.analysisInput}
                  placeholder="Share your analysis..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={analysis}
                  onChangeText={setAnalysis}
                />
              </GlassmorphicCard>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.submitButtonText}>Post Prediction</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  searchSection: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },
  matchItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedMatch: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  matchTeams: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  matchInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  predictionSection: {
    padding: 16,
  },
  predictionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  predictionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  selectedPrediction: {
    backgroundColor: colors.primary,
  },
  predictionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  selectedPredictionText: {
    color: colors.text,
  },
  confidenceSection: {
    padding: 16,
  },
  confidenceSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confidencePercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  analysisSection: {
    padding: 16,
  },
  analysisInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
