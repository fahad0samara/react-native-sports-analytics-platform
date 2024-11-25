import { PredictionPost } from '../types/prediction';

// TODO: Replace with your actual API base URL
const API_BASE_URL = 'https://your-api-url.com';

interface CreatePredictionParams {
  matchId: string;
  prediction: 'home' | 'away' | 'draw';
  confidence: number;
  analysis: string;
}

interface FetchPredictionsParams {
  search?: string;
  filters?: string[];
  limit?: number;
}

interface TrendingTopic {
  id: string;
  title: string;
  type: 'match' | 'tournament' | 'team';
  image: string;
  stats: {
    predictions: number;
    accuracy: number;
  };
}

export const predictionService = {
  async fetchPredictions(
    page: number = 1,
    params: FetchPredictionsParams = {}
  ): Promise<{ predictions: PredictionPost[]; hasMore: boolean }> {
    try {
      // TODO: Replace with actual API call
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
          },
        },
      ];

      // Simulate search and filtering
      let filteredPredictions = mockPredictions;
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredPredictions = filteredPredictions.filter(
          p =>
            p.match.homeTeam.name.toLowerCase().includes(searchLower) ||
            p.match.awayTeam.name.toLowerCase().includes(searchLower) ||
            p.prediction.analysis.toLowerCase().includes(searchLower)
        );
      }

      if (params.filters?.length) {
        filteredPredictions = filteredPredictions.filter(p =>
          params.filters.some(
            f =>
              p.match.league.toLowerCase().includes(f) ||
              (f === 'today' &&
                new Date(p.match.date).toDateString() === new Date().toDateString()) ||
              (f === 'week' &&
                new Date(p.match.date).getTime() - new Date().getTime() <=
                  7 * 24 * 60 * 60 * 1000)
          )
        );
      }

      return {
        predictions: filteredPredictions.slice(
          (page - 1) * (params.limit || 10),
          page * (params.limit || 10)
        ),
        hasMore: filteredPredictions.length > page * (params.limit || 10),
      };
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  async getTrendingTopics(): Promise<TrendingTopic[]> {
    try {
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          title: 'Manchester United vs Liverpool',
          type: 'match',
          image: 'https://example.com/match1.jpg',
          stats: {
            predictions: 1500,
            accuracy: 75,
          },
        },
        {
          id: '2',
          title: 'Premier League',
          type: 'tournament',
          image: 'https://example.com/premier-league.jpg',
          stats: {
            predictions: 5000,
            accuracy: 82,
          },
        },
        {
          id: '3',
          title: 'Real Madrid',
          type: 'team',
          image: 'https://example.com/real-madrid.jpg',
          stats: {
            predictions: 2500,
            accuracy: 68,
          },
        },
      ];
    } catch (error) {
      console.error('Error fetching trending topics:', error);
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
