import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

// Re-export generated types/functions
export * from "./gen";

// Small DX wrapper so consumers don’t interact with raw config everywhere
export type ApiAClientOptions = {
  baseURL: string;
  axios?: AxiosInstance;
  defaultConfig?: AxiosRequestConfig;
};

export function createApiAClient(options: ApiAClientOptions) {
  const instance =
    options.axios ??
    axios.create({
      baseURL: options.baseURL,
    });

  // hey-api axios client typically uses a shared client under the hood.
  // We provide a consistent instance to use across calls.
  return {
    axios: instance,
    requestConfig: options.defaultConfig,
  };
}
