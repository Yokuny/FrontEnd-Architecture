import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { translate } from "../language";
import { clearLocalStorage } from "../Utils";
const baseUserURL = process.env.REACT_APP_URI_BASE;

export const useFetch = (url, options = { method: "get", data: undefined }) => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const enterprise = localStorage.getItem('id_enterprise_filter')

    const headers = {
      token: token || "",
      environment: enterprise
    };

    try {
      const instance = axios.create({
        baseURL: baseUserURL,
        timeout: parseInt(process.env.REACT_APP_URI_TIMEOUT),
        headers,
      });

      instance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response && error.response.status === 401) {
            toast.error(translate("session.expired"));
            clearLocalStorage();
            window.location.href = `${window.location.origin}/login`;
          }
          else if (error.response && error.response.status === 403) {
            if (error.response.data && error.response.data.code)
              toast.warn(translate(error.response.data.code));
            else toast.warn(translate("user.notAllowed"));
          }
          else if (error.response && error.response.status === 400) {
            if (error.response.data && error.response.data.code) {
              toast.warn(translate(error.response.data.code));
            }
            else {
              toast.warn(error.response.data.message);
            }
          }
          else if (error.response && error.response.status === 500) {
            if (error.response.data && error.response.data.code)
              toast.error(translate(error.response.data.code));
            else toast.error(translate("no.connection"));
          }
          else if (error.response && error.response.status === 429) {
            toast.error(translate("server.too.many.request"));
          } else {
            toast.error(translate("no.connection"));
          }
          return Promise.reject(error);
        }
      );

      const res = await instance.request({
        url: url,
        data: options.data,
        method: options.method,
      });
      setData(res.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return { data, error, isLoading, reFetch: fetchData };
};

class Fetch {
  createInstance = async (
    options = {
      defaultTakeCareError: true,
      handleUploadProgress: undefined,
      headers: undefined,
      responseType: undefined,
  }
  ) => {
    const token = localStorage.getItem("token");
    const enterprise = localStorage.getItem('id_enterprise_filter')

    const headers = {
      token: token || "",
      environment: enterprise,
      ...(options.headers || {})
    };

    const uploadProgress = (progressEvent) => {
      if (!!options.handleUploadProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        options.handleUploadProgress(percentCompleted);
      }
    };

    const instance = axios.create({
      baseURL: options?.isV2 ? baseUserURL.replace(`v1`, `v2`) : baseUserURL,
      timeout: parseInt(process.env.REACT_APP_URI_TIMEOUT),
      headers,
      responseType: options?.responseType || "json",
      onUploadProgress: !!options.handleUploadProgress
        ? uploadProgress
        : undefined,
    });

    if (!!options.defaultTakeCareError)
      instance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response && error.response.status === 401) {
            toast.error(translate("session.expired"));
            clearLocalStorage();
            window.location.href = `${window.location.origin}/login`;
          } else if (error.response && error.response.status === 403) {
            if (error.response.data && error.response.data.code)
              toast.warn(translate(error.response.data.code));
            else toast.warn(translate("user.notAllowed"));
          } else if (error.response && error.response.status === 400) {
            if (error.response.data && error.response.data.code)
              toast.warn(translate(error.response.data.code));
            else toast.warn(error.response.data.message);
          } else if (error.response && error.response.status === 500) {
            if (error.response.data && error.response.data.code)
              toast.error(translate(error.response.data.code));
            else toast.error(translate("no.connection"));
          } else if (error.response && error.response.status === 429) {
            toast.error(translate("server.too.many.request"));
          } else {
            toast.error(translate("no.connection"));
          }
          return Promise.reject(error);
        }
      );

    return instance;
  };

  get = async (url, options = { defaultTakeCareError: true, headers: {}, isV2: false }) => {
    const paramsQuery = url.split("?")[1];
    let urlInternalNormalized = url.split("?")[0];
    
    if (paramsQuery) {
      const query = new URLSearchParams(paramsQuery);

      urlInternalNormalized += `?${query.toString()}`;
    }

    return (await this.createInstance(options)).get(urlInternalNormalized);
  };
  post = async (
    url,
    data,
    options = { defaultTakeCareError: true, handleUploadProgress: undefined }
  ) => {
    return (await this.createInstance(options)).post(url, data);
  };
  delete = async (url, options = { defaultTakeCareError: true, headers: {}, isV2: false }) => {
    return (await this.createInstance(options)).delete(url);
  };
  put = async (url, data, options = { defaultTakeCareError: true, headers: {}, isV2: false }) => {
    return (await this.createInstance(options)).put(url, data);
  };
  patch = async (url, data, options = { defaultTakeCareError: true, headers: {}, isV2: false }) => {
    return (await this.createInstance(options)).patch(url, data);
  };
}

export default new Fetch();
