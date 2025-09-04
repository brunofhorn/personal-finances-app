import { FormLoginParams } from "@/screens/Login/LoginForm";
import { FormRegisterParams } from "@/screens/Register/RegisterForm";
import { personalFinances } from "@/shared/api/personal-finances";
import { IAuthenticateResponse } from "@/shared/interfaces/https/authenticate-response";

export const authenticate = async (
  userData: FormLoginParams
): Promise<IAuthenticateResponse> => {
  const { data } = await personalFinances.post<IAuthenticateResponse>(
    "/auth/login",
    userData
  );

  return data;
};

export const registerUser = async (
  userData: FormRegisterParams
): Promise<IAuthenticateResponse> => {
  const { data } = await personalFinances.post<IAuthenticateResponse>(
    "/auth/register",
    userData
  );

  return data;
};
