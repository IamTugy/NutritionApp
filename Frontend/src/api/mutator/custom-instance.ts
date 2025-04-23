import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): CancellablePromise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data) as CancellablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<T> = AxiosError<T>; 