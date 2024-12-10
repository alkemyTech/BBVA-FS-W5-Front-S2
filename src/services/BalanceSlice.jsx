import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchAccountBalance = createAsyncThunk(
  "account/fetchAccountBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("accounts/balance");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al obtener el balance");
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    balance: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchAccountBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default balanceSlice.reducer;