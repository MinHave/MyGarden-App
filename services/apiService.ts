import axios, { AxiosResponse } from 'axios';

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

export interface Credentials {
  username: string;
  password: string;
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
  data: any
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

export const login = async (credentials: Credentials): Promise<ApiResponse> => {
  return post(`${URL_ENDPOINT}/auth/login`, credentials);
};
