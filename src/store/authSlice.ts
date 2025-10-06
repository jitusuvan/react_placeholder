import { createSlice } from '@reduxjs/toolkit';

interface User {
  username: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  users: User[];
}

const initialState: AuthState = {
  isAuthenticated: !!sessionStorage.getItem('isLoggedIn'),
  users: JSON.parse(sessionStorage.getItem('users') || '[]'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action) => {
      state.users.push(action.payload);
      sessionStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action) => {
      const user = state.users.find(u => 
        u.username === action.payload.username && 
        u.password === action.payload.password
      );
      if (user) {
        state.isAuthenticated = true;
        sessionStorage.setItem('isLoggedIn', 'true');
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      sessionStorage.removeItem('isLoggedIn');
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;