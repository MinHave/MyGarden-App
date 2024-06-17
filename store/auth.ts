import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ICurrentUser } from './interfaces/auth';
import ui from '@/store/ui';
import apiService, { ApiResponse } from '@/services/apiService'; // Remove this import

const emptyUserObject: ICurrentUser = {
  expires: '',
  id: '',
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
  async login({
    username,
    password,
    apiService,
  }: {
    username: string;
    password: string;
    apiService: any;
  }): Promise<ApiResponse<ICurrentUser> | null> {
    // Add apiService as parameter
    try {
      const response = await apiService.login({ username, password });
      if (response.data) {
        // Assuming response contains user data and refresh token
        await this.setUser(response.data);
        return response;
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Handle login failure (e.g., update UI state, show error message)
    }
    return null;
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
  async AUTHENTICATE_REFRESH(apiService: any): Promise<boolean> {
    // Add apiService as parameter
    const cachedToken = await this.refreshToken();
    if (cachedToken !== 'logged out' && cachedToken) {
      try {
        const response = await apiService.refreshAuth(cachedToken);
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
    return this.currentUser?.token == '' ? false : true;
  },

  async RESET_PASSWORD(username: string, apiService: any): Promise<void> {
    // Add apiService as parameter
    try {
      await apiService.resetPassword(username);
    } catch (err) {
      console.error('Error resetting password:', err);
    }
  },

  async LOGOUT(): Promise<Boolean> {
    try {
      await AsyncStorage.clear();
      this.currentUser = emptyUserObject;
      // logoutNavigate();
      return true;
    } catch (e) {
      console.error('Logout failed:', e);
      return false;
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
