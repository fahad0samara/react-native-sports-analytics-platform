import { PredictionPost } from '../types/prediction';

// TODO: Replace with your actual API base URL
const API_BASE_URL = 'https://your-api-url.com';

interface CreatePredictionParams {
  matchId: string;
  prediction: 'home' | 'away' | 'draw';
  confidence: number;
  analysis: string;
}

export const predictionService = {
  async fetchPredictions(page: number = 1, limit: number = 10): Promise<{ predictions: PredictionPost[]; hasMore: boolean }> {
    try {
      // TODO: Replace with actual API call
      // Temporary mock implementation
      const mockPredictions: PredictionPost[] = [
        {
          id: String(Math.random()),
          user: {
            id: 'user1',
            username: 'JohnDoe',
            avatar: 'https://example.com/avatar1.jpg',
            verified: true,
          },
          match: {
            homeTeam: {
              name: 'Manchester United',
              logo: 'https://example.com/man-utd.png',
            },
            awayTeam: {
              name: 'Liverpool',
              logo: 'https://example.com/liverpool.png',
            },
            date: new Date().toISOString(),
            league: 'Premier League',
          },
          prediction: {
            winner: 'home',
            confidence: 85,
            analysis: 'Manchester United\'s recent form and home advantage gives them the edge.',
            timestamp: new Date().toISOString(),
          },
          stats: {
            likes: 150,
            comments: 45,
            shares: 12,
          },
          userInteraction: {
            liked: false,
            commented: false,
            shared: false,
          },
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        predictions: mockPredictions,
        hasMore: page < 3, // Mock pagination
      };
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  async createPrediction(params: CreatePredictionParams): Promise<PredictionPost> {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      const newPrediction: PredictionPost = {
        id: String(Math.random()),
        user: {
          id: 'currentUser',
          username: 'CurrentUser',
          avatar: 'https://example.com/current-user.jpg',
          verified: false,
        },
        match: {
          homeTeam: {
            name: 'Team A',
            logo: 'https://example.com/team-a.png',
          },
          awayTeam: {
            name: 'Team B',
            logo: 'https://example.com/team-b.png',
          },
          date: new Date().toISOString(),
          league: 'Premier League',
        },
        prediction: {
          winner: params.prediction,
          confidence: params.confidence,
          analysis: params.analysis,
          timestamp: new Date().toISOString(),
        },
        stats: {
          likes: 0,
          comments: 0,
          shares: 0,
        },
        userInteraction: {
          liked: false,
          commented: false,
          shared: false,
        },
      };

      return newPrediction;
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  },

  async likePrediction(predictionId: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Liked prediction:', predictionId);
    } catch (error) {
      console.error('Error liking prediction:', error);
      throw error;
    }
  },

  async commentOnPrediction(predictionId: string, comment: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Commented on prediction:', predictionId, comment);
    } catch (error) {
      console.error('Error commenting on prediction:', error);
      throw error;
    }
  },

  async sharePrediction(predictionId: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Shared prediction:', predictionId);
    } catch (error) {
      console.error('Error sharing prediction:', error);
      throw error;
    }
  },
};
