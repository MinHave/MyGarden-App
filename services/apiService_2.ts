import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

// import { API_URL } from '@env';
import { credentials, inOptions } from '@/types/apiService';
import auth from '@/store/auth';
import { DateTime } from 'luxon';
import { ICurrentUser } from '@/store/interfaces/auth';
import { ISimplePlant } from '@/types/interfaces';

interface ApiError {
  response?: {
    status?: number;
    data?: string;
  };
}

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
  async handleResponseError(
    err: any
  ): Promise<{ failed: boolean; err: ApiError }> {
    if (err?.response?.status === 401) {
      // not authenticated, consider user logged out
      await auth.LOGOUT();
    } else if (err.response?.status === 400) {
      let desc = 'Server fejl';
      switch (err.response.data) {
        case 'Invalid username or password':
          desc = 'Forkert brugernavn eller kodeord';
          break;
        case 'Phone Used':
        case 'User with phone already exists':
          desc = 'Telefonnummer allerede i brug';
          break;
        case 'Email Used':
        case 'User with email allready exists':
          desc = 'E-mail er allerede i brug';
          break;
        case 'No code found':
          desc = 'Ukendt kode';
          break;
        case 'Cretion fail':
          desc = 'Fejl ved oprettelse';
          break;
        case 'No event code':
          desc = 'Forkert kode';
          break;
        case 'Wrong Team':
          desc = 'Forkert teorihold';
          break;
        case 'Token not found':
          desc = 'Kode allerede brugt';
          break;
        case 'Already Activated':
          desc = 'Bruger allerede aktiveret';
          break;
        case 'User deletion failed':
          desc =
            'Bruger blev ikke slettet korrekt, kontakt support hvis fejlen opstår igen';
          break;

        default:
          console.log('API error', err);
      }

      const backgroundColor = '#e05561';

      showMessage({
        message: 'Api fejl',
        description: desc,
        type: 'default',
        backgroundColor,
      });
    } else if (err?.response?.status === 500) {
      const backgroundColor = '#e05561';

      showMessage({
        message: 'Internal Server Error',
        description: 'Kunne ikke udføre handling',
        type: 'default',
        backgroundColor,
      });
    } else if (
      err.toString() === `Error: timeout of ${this.timeoutTime}ms exceeded`
    ) {
      const backgroundColor = '#e05561';

      showMessage({
        message: 'Ingen forbindelse',
        description: 'Kunne ikke forbinde til serveren',
        type: 'default',
        backgroundColor,
      });
    } else {
      const backgroundColor = '#e05561';

      showMessage({
        message: 'Api fejl',
        description: 'Kunne ikke finde api kald',
        type: 'default',
        backgroundColor,
      });
    }

    return { failed: true, err };
  },
  async handleResponse<T>(
    task: Promise<Response>
  ): Promise<T | { failed: boolean; err: ApiError }> {
    try {
      const response: Response = await task;
      // Ensure response.body is not undefined before casting
      if (response.body === undefined) {
        throw new Error('Response body is undefined');
      }
      return response.body as T;
    } catch (err) {
      return this.handleResponseError(err);
    }
  },
  async post(
    endpoint: string,
    payload: object | string,
    options?: inOptions
  ): Promise<any> {
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
  ): Promise<any> {
    return this.post(endpoint, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  },
  async get(endpoint: string, payload?: object): Promise<any> {
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
  login(credentials: credentials): Promise<ICurrentUser> {
    // Ensure credentials are defined and have the necessary properties
    if (!credentials || typeof credentials !== 'object') {
      throw new Error('Invalid credentials');
    }
    var response = this.post('auth/login', credentials, { noAuth: true });
    console.log('asdadsdasdasasd. ', response);

    return response;
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
