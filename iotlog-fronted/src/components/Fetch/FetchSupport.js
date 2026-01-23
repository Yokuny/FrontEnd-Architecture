import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { translate } from "../language";
import { clearLocalStorage } from "../Utils";

const baseUserURL = process.env.REACT_APP_URI_SUPPORT;

export const useFetchSupport = (
  url,
  options = { method: "get", data: undefined }
) => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const headers = {
      token: token || "",
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

class FetchSupport {
  createInstance = async (options = { defaultTakeCareError: true }) => {
    const token = localStorage.getItem("token");

    const headers = {
      token: token || "",
    };

    const instance = axios.create({
      baseURL: baseUserURL,
      timeout: parseInt(process.env.REACT_APP_URI_TIMEOUT),
      headers,
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

  get = async (url, options = { defaultTakeCareError: true }) => {
    return (await this.createInstance(options)).get(url);
  };
  post = async (url, data, options = { defaultTakeCareError: true }) => {
    return (await this.createInstance(options)).post(url, data);
  };
  delete = async (url) => {
    return (await this.createInstance()).delete(url);
  };
  put = async (url, data) => {
    return (await this.createInstance()).put(url, data);
  };
  patch = async (url, data) => {
    return (await this.createInstance()).patch(url, data);
  };
}

export default new FetchSupport();
