import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { worklogService } from '../../services/worklogService';
import { WorkLog, CreateWorkLogRequest } from '../../types/worklog';

interface WorkLogState {
  worklogs: WorkLog[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkLogState = {
  worklogs: [],
  loading: false,
  error: null,
};

export const addWorkLog = createAsyncThunk(
  'worklog/add',
  async (worklogData: CreateWorkLogRequest) => {
    const response = await worklogService.addWorklog(worklogData);
    return response;
  }
);

export const fetchWorkLogs = createAsyncThunk(
  'worklog/fetch',
  async () => {
    const response = await worklogService.getWorklogs();
    return response;
  }
);

export const fetchDailySummary = createAsyncThunk(
  'worklog/dailySummary',
  async (date: string) => {
    const response = await worklogService.getDailySummary(date);
    return response;
  }
);

const worklogSlice = createSlice({
  name: 'worklog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWorkLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWorkLog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addWorkLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add work log';
      })
      .addCase(fetchWorkLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.worklogs = action.payload.results || action.payload;
      })
      .addCase(fetchWorkLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch work logs';
      })
      .addCase(fetchDailySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailySummary.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch daily summary';
      });
  },
});

export const { clearError } = worklogSlice.actions;
export default worklogSlice.reducer;
