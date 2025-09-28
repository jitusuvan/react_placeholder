import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { holidayService } from '../../services/holidayService';
import { Holiday, CreateHolidayRequest } from '../../types/holiday';

interface HolidayState {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
}

const initialState: HolidayState = {
  holidays: [],
  loading: false,
  error: null,
};

export const fetchHolidays = createAsyncThunk(
  'holiday/fetch',
  async () => {
    const response = await holidayService.getHolidays();
    return response;
  }
);

export const createHoliday = createAsyncThunk(
  'holiday/create',
  async (holidayData: CreateHolidayRequest) => {
    const response = await holidayService.createHoliday(holidayData);
    return response;
  }
);

export const updateHoliday = createAsyncThunk(
  'holiday/update',
  async ({ id, data }: { id: number; data: CreateHolidayRequest }) => {
    const response = await holidayService.updateHoliday(id, data);
    return response;
  }
);

export const deleteHoliday = createAsyncThunk(
  'holiday/delete',
  async (id: number) => {
    await holidayService.deleteHoliday(id);
    return id;
  }
);

const holidaySlice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload.results || action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch holidays';
      })
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHoliday.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create holiday';
      })
      .addCase(updateHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHoliday.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update holiday';
      })
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete holiday';
      });
  },
});

export const { clearError } = holidaySlice.actions;
export default holidaySlice.reducer;
