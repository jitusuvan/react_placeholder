import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AccountState {
  accounts: Account[];
  filteredAccounts: Account[];
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  filteredAccounts: [],
  currentPage: 1,
  itemsPerPage: 5,
  searchTerm: '',
  loading: false,
  error: null,
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async () => {
    const response = await fetch('http://localhost:8000/api/accounts/', {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (data: { name: string; email: string; phone: string }) => {
    const response = await fetch('http://localhost:8000/api/accounts/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create account');
    return response.json();
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async ({ id, data }: { id: string; data: Partial<Account> }) => {
    const response = await fetch(`http://localhost:8000/api/accounts/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update account');
    return response.json();
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (id: string) => {
    const response = await fetch(`http://localhost:8000/api/accounts/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete account');
    return id;
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    searchAccounts: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredAccounts = state.accounts.filter(acc =>
        acc.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        acc.email.toLowerCase().includes(action.payload.toLowerCase())
      );
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        state.filteredAccounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.unshift(action.payload);
        state.filteredAccounts = state.accounts;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
          state.filteredAccounts = state.accounts;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
        state.filteredAccounts = state.accounts;
      });
  },
});

export const { searchAccounts, setCurrentPage } = accountSlice.actions;
export default accountSlice.reducer;