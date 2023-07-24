import { isAxiosError } from "axios";

export const handleAxiosError = (error: unknown, defaultErrorMessage = "Something went wrong"): string => {
  if (isAxiosError(error)) {
    return error.response?.data || defaultErrorMessage;
  } else {
    return defaultErrorMessage;
  }
};
