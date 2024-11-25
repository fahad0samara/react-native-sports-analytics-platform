import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Match } from '../../types';

interface MatchesState {
  matches: Match[];
  selectedMatch: Match | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  selectedMatch: null,
  isLoading: false,
  error: null,
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    setSelectedMatch: (state, action: PayloadAction<Match | null>) => {
      state.selectedMatch = action.payload;
    },
    updateMatch: (state, action: PayloadAction<Match>) => {
      const index = state.matches.findIndex((match) => match.id === action.payload.id);
      if (index !== -1) {
        state.matches[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMatches,
  setSelectedMatch,
  updateMatch,
  setLoading,
  setError,
} = matchesSlice.actions;
export default matchesSlice.reducer;
