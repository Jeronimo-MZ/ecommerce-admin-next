import { isAxiosError } from "axios";

export const handleAxiosError = (
  error: unknown,
  defaultErrorMessage = "Oops! Algo deu errado. Tente novamente mais tarde",
): string => {
  if (isAxiosError(error)) {
    return error.response?.data || defaultErrorMessage;
  } else {
    console.error(error);
    return defaultErrorMessage;
  }
};
