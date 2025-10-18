import { useVerifyToken } from "../lib/api/queries/auth";
import { getToken } from "../lib/auth";

export const useShowUserOnlyButton = () => {
  const token = getToken();
  const { data: verifyData } = useVerifyToken(token ?? "");
  return verifyData?.role === "USER";
};
