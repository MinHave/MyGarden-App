import axios from 'axios';

// import { API_URL } from '@env';
import { credentials, inOptions } from '@/types/apiService';
import auth from '@/store/auth';
import { DateTime } from 'luxon';
import { ICurrentUser } from '@/store/interfaces/auth';
import { ISimplePlant } from '@/types/interfaces';

const service = {
  api: 'http://localhost:5000',
  timeoutTime: 20000,

  async getOptions(inOptions?: inOptions): Promise<any> {
    if (
      !inOptions?.noAuth &&
      auth.currentUser.expires <
        DateTime.local().setZone('Europe/Copenhagen').toISO()
    ) {
      console.log('token expired, refreshing');
      const getRefreshToken = await auth.refreshToken();
      const user = await this.refreshAuth(getRefreshToken);
      await auth.setUser(user);
    }

    const token = auth.authToken();
    if (!inOptions?.noAuth && token) {
      return {
        ...inOptions,
        timeout: this.timeoutTime,
        headers: {
          Authorization: `Bearer ${token}`,
          ...inOptions?.headers,
        },
      };
    } else {
      return {
        ...inOptions,
        timeout: this.timeoutTime,
      };
    }
  },

  async handleResponse(task: any): Promise<any> {},

  async post(endpoint: string, payload: object | string, options?: inOptions) {
    return this.handleResponse(
      axios.post(
        `${this.api}/${endpoint}`,
        payload,
        await this.getOptions(options)
      )
    );
  },
  postJsonString(
    endpoint: string,
    payload: object | string,
    options: inOptions
  ) {
    return this.post(endpoint, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  },
  async get(endpoint: string, payload?: object) {
    return this.handleResponse(
      axios.get(`${this.api}/${endpoint}`, await this.getOptions(payload))
    );
  },
  async put(endpoint: string, payload: object, options: inOptions) {
    return this.handleResponse(
      axios.put(
        `${this.api}/${endpoint}`,
        payload,
        await this.getOptions(options ?? options)
      )
    );
  },
  async delete(endpoint: string, payload: object) {
    return this.handleResponse(
      axios.delete(`${this.api}/${endpoint}`, await this.getOptions(payload))
    );
  },

  //#region Endpoints

  //#region Auth
  login(credentials: credentials) {
    return this.post('auth/login', credentials, { noAuth: true });
  },
  refreshAuth(refreshCode: string): Promise<ICurrentUser> {
    return this.postJsonString('auth/refresh', refreshCode, { noAuth: true });
  },
  changePassword(passwordChanges: string) {
    return this.post('auth/changePassword', passwordChanges);
  },
  resetPassword(username: string) {
    return this.postJsonString('auth/resetPassword', username, {
      noAuth: true,
    });
  },

  //#endregion Auth

  getPlants(gardenId: string | undefined): Promise<ISimplePlant[]> {
    return this.get(`plant/gardenPlants/${gardenId}`);
  },
  getPlant(id: string) {
    return this.get(`plant/${id}`);
  },
  getGardenList() {
    return this.get(`garden`);
  },

  //#endregion Endpoints
};
export default service;
