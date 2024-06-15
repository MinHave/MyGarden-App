import { ICurrentUser } from '@/store/interfaces/auth';
import axios, { AxiosResponse } from 'axios';
import { credentials, inOptions } from '@/types/apiService';
import {
  IGardenDetails,
  IPlantDetails,
  ISimpleGarden,
  ISimplePlant,
} from '@/types/interfaces';

// Replace with your machine's IP address and port number
const URL_ENDPOINT = 'https://api.tavsogmatias.com';

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

const get = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  try {
    console.log(`GET request to: ${url}`);
    const response: AxiosResponse<T> = await api.get(url);
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
  options?: inOptions
): Promise<ApiResponse<T>> => {
  try {
    console.log(`POST request to: ${url} with data:`, data);
    const response: AxiosResponse<T> = await api.post(url, data);
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
  options: inOptions
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
  data: any
): Promise<ApiResponse<T>> => {
  try {
    console.log(`PUT request to: ${url} with data:`, data);
    const response: AxiosResponse<T> = await api.put(url, data);
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

const del = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  try {
    console.log(`DELETE request to: ${url}`);
    const response: AxiosResponse<T> = await api.delete(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('DELETE request error:', error);
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
  async getPlant(plantId: string): Promise<ApiResponse<ISimplePlant>> {
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
    return put(`plant`, plant);
  },
  async updateGarden(
    garden: IGardenDetails
  ): Promise<ApiResponse<IPlantDetails>> {
    return put(`garden`, garden);
  },

  //#endregion Setters
};

export default service;
