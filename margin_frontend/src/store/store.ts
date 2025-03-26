import { configureStore } from '@reduxjs/toolkit';
import cryptoDashboardReducer from './cryptoDashboard/cryptoDashboardSlice';

export const store = configureStore({
  reducer: {
    cryptoDashboard: cryptoDashboardReducer,
  },
});
