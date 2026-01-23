import jwt_decode from "jwt-decode";
import cryptoJs from "crypto-js";
import { Fetch } from "../components";

const _Tv_d = (a, time) => {
  try {
    return cryptoJs.AES.encrypt(
      a,
      `${process.env.REACT_APP_SSO_TOKEN}${time}`
    ).toString();
  } catch {
    return "";
  }
};

export async function extenalSignIn({ email, password }) {
  try {
    const response = await Fetch.post("/external/auth", { email: email ? email.replace(/ /g, "") : "", password });
    if (!response.data?.token) {
      return
    }

    const userData = jwt_decode(response.data.token);
    return {
      token: response.data?.token,
      user: userData,
    };
  } catch (error) {
    if (error?.response?.data?.isBlockedTemporary)
      return {
        id: error?.response?.data?.id,
        isBlockedTemporary: error?.response?.data?.isBlockedTemporary,
      }

    return;
  }
}

export async function signIn({ email, password }) {
  try {
    const response = await Fetch.post("/auth/login", { email: email ? email.trim() : "", password });
    if (!response.data?.token) {
      return
    }

    const userData = jwt_decode(response.data.token);
    return {
      token: response.data?.token,
      user: userData,
    };
  } catch (error) {
    if (error?.response?.data?.isBlockedTemporary)
      return {
        id: error?.response?.data?.id,
        isBlockedTemporary: error?.response?.data?.isBlockedTemporary,
      }

    return;
  }
}

export async function signInSSO({ email, idToken, token }) {
  try {
    const time = new Date().getTime();
    const response = await Fetch.post("/auth/login/sso", {
      token: _Tv_d(JSON.stringify({
        email: email ? email.trim() : "",
        token,
        idToken
      }), time)
    },
      {
        defaultTakeCareError: true,
        headers: {
          "x-time": time,
        }
      });
    if (!response.data?.token) {
      return
    }

    const userData = jwt_decode(response.data.token);
    return {
      token: response.data?.token,
      user: userData,
    };
  } catch (error) {
    if (error?.response?.data?.isBlockedTemporary)
      return {
        id: error?.response?.data?.id,
        isBlockedTemporary: error?.response?.data?.isBlockedTemporary,
      }

    return;
  }
}

