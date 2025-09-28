import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaveService } from '../../services/leaveService';
import { LeaveRecord, LeaveRequest } from '../../types/leave';

interface LeaveState {
  leaves: LeaveRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaves: [],
  loading: false,
  error: null,
};

export const applyLeave = createAsyncThunk(
  'leave/apply',
  async (leaveData: LeaveRequest) => {
    const response = await leaveService.applyLeave(leaveData);
    return response;
  }
);

export const fetchLeaves = createAsyncThunk(
  'leave/fetch',
  async () => {
    const response = await leaveService.getLeaveRecords();
    return response;
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to apply leave';
      })
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.results || action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leaves';
      });
  },
});

export const { clearError } = leaveSlice.actions;
export default leaveSlice.reducer;
