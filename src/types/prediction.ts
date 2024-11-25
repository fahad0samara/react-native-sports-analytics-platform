export interface PredictionPost {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  match: {
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
  prediction: {
    winner: 'home' | 'away' | 'draw';
    confidence: number;
    analysis: string;
    timestamp: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  userInteraction: {
    liked: boolean;
    commented: boolean;
    shared: boolean;
  };
}
