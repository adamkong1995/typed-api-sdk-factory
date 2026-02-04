import type { AxiosInstance } from "axios";
import axios from "axios";

export * from "./gen";
export type { Options } from "./gen";

export type ApiBClientOptions = {
  baseURL: string;
  axiosInstance?: AxiosInstance;
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
};

export function createApiBClient(opts: ApiBClientOptions) {
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
