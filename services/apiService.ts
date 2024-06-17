import axios, { AxiosResponse } from 'axios';
import { credentials, inOptions } from '@/types/apiService';
import {
  IGardenDetails,
  IPlantDetails,
  ISimpleGarden,
  ISimplePlant,
} from '@/types/interfaces';
import auth from '@/store/auth'; // Remove this import
import { DateTime } from 'luxon';
import { ICurrentUser } from '@/store/interfaces/auth';

// Replace with your machine's IP address and port number
const URL_ENDPOINT = 'https://api.tavsogmatias.com';
const timeoutTime = 20000;

const api = axios.create({
  baseURL: URL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const getOptions = async (inOptions?: inOptions): Promise<any> => {
  if (
    !inOptions?.noAuth &&
    auth.isAuthorized() &&
    auth.currentUser.expires <
      DateTime.local().setZone('Europe/Copenhagen').toISO()
  ) {
    console.log('token expired, refreshing');
    const getRefreshToken = await auth.refreshToken();
    const response = await service.refreshAuth(getRefreshToken);
    await auth.setUser(response.data!);
  }

  const token = auth.authToken();
  if (!inOptions?.noAuth && token) {
    return {
      ...inOptions,
      timeout: timeoutTime,
      headers: {
        Authorization: `Bearer ${token}`,
        ...inOptions?.headers,
      },
    };
  } else {
    return {
      ...inOptions,
      timeout: timeoutTime,
    };
  }
};

const get = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  try {
    console.log(`GET request to: ${url}`);
    const response: AxiosResponse<T> = await api.get(url, await getOptions());
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('GET request error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

const post = async <T = any>(
  url: string,
  data: object | string,
  options?: inOptions | null
): Promise<ApiResponse<T>> => {
  try {
    console.log(`POST request to: ${url} with data:`, data);
    const response: AxiosResponse<T> = await api.post(
      url,
      data,
      await getOptions(options!)
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('POST request error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

const postJsonString = async <T = any>(
  url: string,
  payload: object | string,
  options: inOptions | null
): Promise<ApiResponse<T>> => {
  return post(url, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
};

const put = async <T = any>(
  url: string,
  data: any,
  options: inOptions | null
): Promise<ApiResponse<T>> => {
  try {
    console.log(`PUT request to: ${url} with data:`, data);
    const response: AxiosResponse<T> = await api.put(
      url,
      data,
      await getOptions(options!)
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('PUT request error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

const service = {
  api: 'http://localhost:5000',

  //#region Auth
  async login(credentials: credentials): Promise<ApiResponse<ICurrentUser>> {
    return post(`${URL_ENDPOINT}/auth/login`, credentials);
  },
  async refreshAuth(refreshCode: string): Promise<ApiResponse<ICurrentUser>> {
    return postJsonString('auth/refresh', refreshCode, { noAuth: true });
  },
  async resetPassword(username: string): Promise<ApiResponse<any>> {
    return postJsonString('auth/resetPassword', username, { noAuth: true });
  },
  //#endregion Auth

  //#region Getters
  async getPlants(
    gardenId: string | undefined
  ): Promise<ApiResponse<ISimplePlant[]>> {
    return get(`plant/gardenPlants/${gardenId}`);
  },
  async getPlant(plantId: string): Promise<ApiResponse<IPlantDetails>> {
    return get(`plant/${plantId}`);
  },
  async getGardenList(): Promise<ApiResponse<ISimpleGarden[]>> {
    return get(`garden`);
  },
  async getGarden(gardenId: string): Promise<ApiResponse<ISimpleGarden>> {
    return get(`garden/${gardenId}`);
  },
  //#endregion Getters

  //#region Setters
  async updatePlant(plant: IPlantDetails): Promise<ApiResponse<IPlantDetails>> {
    return put(`plant`, plant, null);
  },
  async updateGarden(
    garden: IGardenDetails
  ): Promise<ApiResponse<IPlantDetails>> {
    return put(`garden`, garden, null);
  },

  //#endregion Setters
};

export default service;
