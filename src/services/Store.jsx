import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../services/UserSlice';
import accountReducer from '../services/AccountSlice';
import transactionReducer from '../services/TransactionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
    transactions: transactionReducer
  },
});
