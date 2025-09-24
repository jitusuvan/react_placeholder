import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface UserPayload {
  user_id: string;
  email: string;
  exp: number;
  iat: number;
}

interface AuthState {
  user: UserPayload | null;
  authTokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const parseJwt = (token: string): UserPayload | null => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
};

const getInitialTokens = (): AuthTokens | null => {
  const tokenString = localStorage.getItem('authTokens');
  return tokenString ? JSON.parse(tokenString) : null;
};

const initialTokens = getInitialTokens();

const initialState: AuthState = {
  user: initialTokens ? parseJwt(initialTokens.access) : null,
  authTokens: initialTokens,
  isAuthenticated: !!initialTokens,
  loading: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch(`${API_HOST}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login failed');
    const data: AuthTokens = await res.json();
    localStorage.setItem('authTokens', JSON.stringify(data));
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.authTokens = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authTokens');
      message.success('Logged out');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authTokens = action.payload;
        state.user = parseJwt(action.payload.access);
        state.isAuthenticated = true;
        message.success('Login successful');
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        message.error('Invalid credentials');
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
