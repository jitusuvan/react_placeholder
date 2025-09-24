import { apiClient } from "../api/apiClient";

interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  return apiClient.post("/auth/register/", data);
};
