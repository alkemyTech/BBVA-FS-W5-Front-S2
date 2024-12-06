import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../services/UserSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
