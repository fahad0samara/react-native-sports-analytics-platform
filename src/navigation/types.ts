import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  SocialFeed: undefined;
  Comments: { predictionId: string };
  UserProfile: { userId: string };
  Search: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Matches: NavigatorScreenParams<MatchesStackParamList>;
  Predictions: NavigatorScreenParams<PredictionsStackParamList>;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  MatchDetails: { matchId: string };
  TeamDetails: { teamId: string };
};

export type MatchesStackParamList = {
  MatchesList: undefined;
  MatchDetails: { matchId: string };
  CreatePrediction: { matchId: string };
};

export type PredictionsStackParamList = {
  PredictionsList: undefined;
  PredictionDetails: { predictionId: string };
  PredictionStats: undefined;
  CreatePrediction: { match: Match };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Statistics: undefined;
};

export type SocialStackParamList = {
  SocialFeed: undefined;
  Comments: { predictionId: string };
  UserProfile: { userId: string };
  Search: undefined;
  PredictionDetails: { predictionId: string };
};
