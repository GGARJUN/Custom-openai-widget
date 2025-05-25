import axios from "axios";
import {
  signIn,
  signUp,
  resetPassword,
  signOut,
  fetchAuthSession,
} from "@aws-amplify/auth";


const API_BASE_URL = process.env.NEXT_PUBLIC_AWS_API_BASE_URL;

export const authServices = {
  register: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}auth/signUp`, payload);
    return response.data;
  },

  login: async (payload) => {
    try {
      const result = await signIn({
        username: payload.email,
        password: payload.password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  forgotPasswordGetCode: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}auth/forgotPwd`, payload);
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await axios.patch(`${API_BASE_URL}auth/resetPwd`, payload);
    return response.data;
  },

  getAuthenticatUser: async () => {
    return await fetchAuthSession();
  },

  logout: async () => {
    await signOut();
  },
};