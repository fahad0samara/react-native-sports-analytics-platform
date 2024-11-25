import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Prediction } from '../../types';

interface PredictionsState {
  predictions: Prediction[];
  userPredictions: Prediction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PredictionsState = {
  predictions: [],
  userPredictions: [],
  isLoading: false,
  error: null,
};

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setPredictions: (state, action: PayloadAction<Prediction[]>) => {
      state.predictions = action.payload;
    },
    setUserPredictions: (state, action: PayloadAction<Prediction[]>) => {
      state.userPredictions = action.payload;
    },
    addPrediction: (state, action: PayloadAction<Prediction>) => {
      state.predictions.push(action.payload);
      state.userPredictions.push(action.payload);
    },
    updatePrediction: (state, action: PayloadAction<Prediction>) => {
      const updatePredictionInArray = (array: Prediction[]) => {
        const index = array.findIndex((pred) => 
          pred.userId === action.payload.userId && 
          pred.timestamp === action.payload.timestamp
        );
        if (index !== -1) {
          array[index] = action.payload;
        }
      };
      
      updatePredictionInArray(state.predictions);
      updatePredictionInArray(state.userPredictions);
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
  setPredictions,
  setUserPredictions,
  addPrediction,
  updatePrediction,
  setLoading,
  setError,
} = predictionsSlice.actions;
export default predictionsSlice.reducer;
