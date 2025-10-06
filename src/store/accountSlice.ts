import { createSlice } from '@reduxjs/toolkit';

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
}

const initialState: AccountState = {
  accounts: JSON.parse(sessionStorage.getItem('accounts') || '[]'),
  filteredAccounts: JSON.parse(sessionStorage.getItem('accounts') || '[]'),
  currentPage: 1,
  itemsPerPage: 5,
  searchTerm: '',
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action) => {
      const newAccount = { ...action.payload, id: Date.now().toString() };
      state.accounts.push(newAccount);
      state.filteredAccounts = state.accounts;
      sessionStorage.setItem('accounts', JSON.stringify(state.accounts));
    },
    updateAccount: (state, action) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
        state.filteredAccounts = state.accounts;
        sessionStorage.setItem('accounts', JSON.stringify(state.accounts));
      }
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
      state.filteredAccounts = state.accounts;
      sessionStorage.setItem('accounts', JSON.stringify(state.accounts));
    },
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
});

export const { addAccount, updateAccount, deleteAccount, searchAccounts, setCurrentPage } = accountSlice.actions;
export default accountSlice.reducer;