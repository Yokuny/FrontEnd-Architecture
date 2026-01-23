import React, { createContext, useState, useContext } from "react";
import { useMsal } from "@azure/msal-react";
import * as auth from "../../services/AuthService";
import { clearLocalStorage } from "../Utils";

const AuthContext = createContext({});

const getUser = () => {
  try {
    const storagedUser = localStorage.getItem("user");
    return JSON.parse(storagedUser)
  }
  catch {
    return null
  }
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [isSigned, setIsSigned] = useState(!!localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const [locked, setLocked] = useState(undefined);
  const [rememberEmail, setRememberEmail] = useState(false);

  const { instance } = useMsal();

  async function externalSignIn({ email, password }, callback) {
    setIsLoading(true);

    const response = await auth.extenalSignIn({ email, password });

    if (response?.isBlockedTemporary) {
      setLocked(response)
      return;
    }

    if (!response) {
      setIsLoading(false);
      return;
    }

    setUser(response.user);
    setIsLoading(false);

    if (callback)
      callback(response);
  }

  async function signIn({ email, password }, callback) {
    setIsLoading(true);
    const response = await auth.signIn({ email, password });
    if (response?.isBlockedTemporary) {
      setLocked(response)
      return;
    }
    if (!response) {
      setIsLoading(false);
      setIsSigned(false);
      return;
    }
    localStorage.setItem("token", response.token);
    if (response.user?.request)
      localStorage.setItem("id_enterprise_filter", response.user?.request);
    localStorage.setItem("typelog", "normal");
    localStorage.setItem("map_show_name", "true");
    setUser(response.user);
    setIsSigned(true);
    setIsLoading(false);
    if (callback)
      callback(response.user);
  }

  async function signInSSO({ email, token, idToken, reCaptcha }, callback) {
    setIsLoading(true);
    const response = await auth.signInSSO({ email, token, idToken, reCaptcha });
    if (response?.isBlockedTemporary) {
      setLocked(response)
      return;
    }
    if (!response) {
      setIsLoading(false);
      setIsSigned(false);
      return;
    }
    localStorage.setItem("token", response.token);
    localStorage.setItem("id_enterprise_filter", response.user?.request);
    localStorage.setItem("typelog", "sal");
    localStorage.setItem("map_show_name", "true");
    setUser(response.user);
    setIsSigned(true);
    setIsLoading(false);
    if (callback)
      callback(response.user);
  }

  function signOut() {
    if (localStorage.getItem("typelog") === "sal") {
      if (instance) {
        instance
          .logoutPopup({
            mainWindowRedirectUri: '/', // redirects the top level app after logout
            account: instance.getActiveAccount(),
          })
          .catch((error) => { });
      }
    }
    clearLocalStorage();
    setUser(null);
    setIsSigned(false);
  }

  return (
    <>
      <AuthContext.Provider
        value={{ isSigned, user, isLoading, locked, signIn, signOut, signInSSO, externalSignIn, rememberEmail, setRememberEmail }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
