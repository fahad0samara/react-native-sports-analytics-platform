export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  predictionAccuracy?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: Score;
  odds?: Odds;
  prediction?: Prediction;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  stats?: TeamStats;
}

export interface Score {
  home: number;
  away: number;
}

export interface Odds {
  home: number;
  draw: number;
  away: number;
}

export interface Prediction {
  winner: 'home' | 'draw' | 'away';
  confidence: number;
  userId: string;
  timestamp: string;
}

export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
}
