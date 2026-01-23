import jwt_decode from "jwt-decode";

export const decodeJwt = (t) => {
  try {
    return jwt_decode(t);
  } catch {
    return "";
  }
};
