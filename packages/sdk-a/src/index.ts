import type { AxiosInstance } from "axios";
import axios from "axios";

export * from "./gen"; // re-export generated functions + types
export type { Options } from "./gen";

export type ApiAClientOptions = {
  baseURL: string;
  axiosInstance?: AxiosInstance;
  // Optional: inject headers (e.g., auth) later
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
};

/**
 * Creates a default Options object that you pass into generated SDK functions.
 * Generated functions like `getHealth(options)` and `getCustomersByCustomerId(data, options)`
 * will use this axios instance + baseURL.
 */
export function createApiAClient(opts: ApiAClientOptions) {
  const instance =
    opts.axiosInstance ??
    axios.create({
      baseURL: opts.baseURL,
    });

  const options = async () => {
    const headers = (await opts.getHeaders?.()) ?? {};
    return {
      axios: instance,
      headers,
    };
  };

  return { axios: instance, options };
}
