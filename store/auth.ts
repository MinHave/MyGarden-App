import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ICurrentUser } from './interfaces/auth';
import ui from '@/store/ui';
import { login, refreshAuth, resetPassword } from '@/services/apiService';
import { logoutNavigate } from '../components/RootNavigation';

const emptyUserObject: ICurrentUser = {
  expires: '',
  id: undefined,
  token: '',
  name: '',
  username: '',
  phoneNumber: '',
  refreshToken: '',
  roles: [],
};

const auth = {
  currentUser: emptyUserObject as ICurrentUser,

  // Getters
  authToken(): string | null {
    return this.currentUser?.token ?? null;
  },
  async refreshToken(): Promise<string> {
    return (await AsyncStorage.getItem('@refreshToken')) ?? '';
  },
  async login(username: string, password: string): Promise<void> {
    try {
      const response = await login({ username, password });
      if (response.data) {
        // Assuming response contains user data and refresh token
        await this.setUser(response.data);
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Handle login failure (e.g., update UI state, show error message)
    }
  },

  // Setters
  async setUser(userData: ICurrentUser): Promise<void> {
    try {
      this.currentUser = userData;
      await AsyncStorage.setItem('@refreshToken', userData.refreshToken);
    } catch (err) {
      console.error('Error setting user:', err);
    }
  },

  // Handlers
  async AUTHENTICATE_REFRESH(): Promise<boolean> {
    const cachedToken = await this.refreshToken();
    if (cachedToken !== 'logged out' && cachedToken) {
      try {
        const response = await refreshAuth(cachedToken);
        if (response.data) {
          await this.setUser(response.data);
          return true;
        }
      } catch (err: any) {
        console.error('Error refreshing auth:', err);
        if (err?.response?.status === 401) {
          await AsyncStorage.setItem('@refreshToken', '');
        }
        // Consider additional error handling here
      }
    }
    return false;
  },

  isAuthorized() {
    return this.currentUser.token == '' ? false : true;
  },

  async RESET_PASSWORD(username: string): Promise<void> {
    try {
      await resetPassword(username);
    } catch (err) {
      console.error('Error resetting password:', err);
    }
  },

  async LOGOUT(): Promise<void> {
    try {
      await AsyncStorage.clear();
      this.currentUser = emptyUserObject;
      logoutNavigate();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  },

  async CLEARSTORAGE(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  },
};

export default auth;
