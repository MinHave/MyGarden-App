import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ICurrentUser } from "./interfaces/auth";
import ui from "@/store/ui";
import apiService from "@/services/apiService";

const auth = {
  currentUser: {} as ICurrentUser,

  // Getters
  authToken() {
    return this.currentUser.token;
  },
  async refreshToken(): Promise<string> {
    return (await AsyncStorage.getItem("@refreshToken")) ?? "";
  },
  async login(username: string, password: string) {
    let response = await apiService.login({ username, password });
  },

  // setters
  async setUser(userData: ICurrentUser) {
    try {
      this.currentUser = userData;
      await AsyncStorage.setItem("@refreshToken", userData.refreshToken);
    } catch (err) {
      console.log(err);
    }
  },
};

export default auth;
