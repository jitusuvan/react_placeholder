import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord, CheckInResponse, CheckOutResponse } from '../../types/attendance';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
};

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async () => {
    const response = await attendanceService.checkIn();
    return response;
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async () => {
    const response = await attendanceService.checkOut();
    return response;
  }
);

export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchRecords',
  async () => {
    const response = await attendanceService.getAttendanceRecords();
    return response;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Check-in failed';
      })
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Check-out failed';
      })
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.results || action.payload;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance records';
      });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
