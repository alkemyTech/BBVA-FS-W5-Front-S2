import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../services/UserSlice';
import balanceReducer from '../services/BalanceSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    balance: balanceReducer,
  },
});