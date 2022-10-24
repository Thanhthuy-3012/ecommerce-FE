import jwtDecode from "jwt-decode";
import { CONSTANTS } from "./constants";

export const authRouter = () => {
  const auth = {
    isAuth: false,
    isAdmin: false
  };
  const token = window.localStorage.getItem(CONSTANTS.TOKEN);
  const isAdmin = window.localStorage.getItem('isAdmin');
  if (token) {
    const decodedJwt = jwtDecode(token);
    const isExp = decodedJwt.exp < Date.now() / 1000;
    if (isExp) {
      localStorage.removeItem(CONSTANTS.TOKEN);
    }
    auth.isAuth = !isExp;
  }

  if (isAdmin) auth.isAdmin = isAdmin;
  
  return auth;
};
